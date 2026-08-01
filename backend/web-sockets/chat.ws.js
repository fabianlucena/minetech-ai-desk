import { tryParseJSON } from '../utils/json.js';
import { getDependency } from '../dependency.js';
import { WSFatalError, WSError } from './WSError.js';

const config = getDependency('config');
const logger = getDependency('logger');
let technicianService;
let sessionService;
let conversationService;

const peers = new Map();

export const routes = {
  '/ws/chat': handler,
  '/ws/chat/:uuid': handler,
};

export function handler(ws) {
  technicianService = getDependency('technicianService');
  sessionService = getDependency('sessionService');
  conversationService = getDependency('conversationService');

  ws.on('message', async (raw) => {
    if (!raw || !raw.length)
      return;

    let res;
    try {      
      const msg = tryParseJSON(raw);
      if (!msg) {
        const clientInfo = peers.get(ws);
        if (!clientInfo || !clientInfo.session || clientInfo.errorCount >= config.maxWSErrorCount)
          throw new WSFatalError(1007, 'El JSON recibido es inválido');

        clientInfo.errorCount = (clientInfo.errorCount || 0) + 1;
        throw new WSError('El JSON recibido es inválido');
      } else {
        const clientInfo = peers.get(ws);
        if (clientInfo)
          clientInfo.errorCount = 0;
      }
      
      if (msg.type === 'auth') 
        res = await handleAuth({msg, ws, conversationUuid: ws.params.uuid});
      else if (msg.type === 'send_message')
        res = await handleSendMessage({msg, ws});
      else
        throw new WSError('Tipo de mensaje desconocido');
    } catch (err) {
      if (err.code) {
        logger.error(`WS fatal error ('${err.code}'): ${err.message}, closing connection`);
        ws.close(err.code, err.message);
        return;
      } else {
        logger.error(`WS error: ${err.message}`);
        res = {
          type: 'error',
          message: err.message,
        };
      }
    }

    if (res) {
      if (typeof res !== 'string')
        res = JSON.stringify(res);

      ws.send(res);
    }
  });

  ws.on('close', () => {
    peers.delete(ws);
  });
}

export async function sendMessageToConversationId(conversationId, message) {
  let payload = {
    type: 'chat_message',
    message,
  };
  payload = JSON.stringify(payload);

  const filteredPeers = [...peers.entries()]
    .filter(([, info]) => info && info.conversationId === conversationId);
  for (const [ws] of filteredPeers) {
    try {
      await ws.send(payload);
    } catch (err) {
      peers.delete(ws);
      logger.warn(`Failed to send WS message to conversationId=${conversationId}: ${err.message}`);
    }
  }
}

export async function sendMessageToTechnicianId(technicianId, message) {
  let payload = {
    type: 'chat_message',
    message,
  };
  payload = JSON.stringify(payload);

  const filteredPeers = [...peers.entries()]
    .filter(([, info]) => info && info.technicianId === technicianId);
  for (const [ws] of filteredPeers) {
    try {
      await ws.send(payload);
    } catch (err) {      
      peers.delete(ws);
      logger.warn(`Failed to send WS message to technicianId=${technicianId}: ${err.message}`);
    }
  }
}

async function handleAuth({msg, ws, conversationUuid}) {
  if (!msg.token)
    throw new WSFatalError(1008, 'Falta el token de autorización');

  let session = await sessionService.getByAuthorizationToken(msg.token);
  if (!session)
    throw new WSFatalError(1008, 'Token de autorización inválido');

  if (session.closedAt)
    throw new WSFatalError(1008, 'La sesión está cerrada');

  if (session.expiresAt < new Date())
    throw new WSFatalError(1008, 'La sesión ha expirado');

  const technician = await technicianService.getById(session.userId);
  if (technician) {
    peers.set(ws, { session, technicianId: technician?.id, errorCount: 0 });
    return { type: 'auth_success' };
  }

  if (conversationUuid) {
    const conversationId = await conversationService.getIdByUuid(conversationUuid);
    if (conversationId) {
      session = await sessionService.decorateWithCredentials(session);
      if (!session)
        throw new WSFatalError(1008, 'Error al decorar la sesión con credenciales');

      if (session.permissions?.find?.(p => p.name === 'conversations.viewChat')) {
        peers.set(ws, { session, conversationId, errorCount: 0 });
        return { type: 'auth_success' };
      }
    }
  }

  throw new WSFatalError(1008, 'Usted no tiene permiso para usar el chat');
}

async function handleSendMessage({msg, ws}) {
  if (!peers.has(ws))
    throw new WSError('Técnico no autenticado');

  const clientInfo = peers.get(ws);
  if (!clientInfo.session)
    throw new WSError('Técnico no autenticado');

  if (!clientInfo.technicianId)
    throw new WSError('El cliente conectado no es un técnico');

  if (!msg.conversationUuid)
    throw new WSError('Conversación no especificada');

  await conversationService.addTechnicianMessage({
    conversationUuid: msg.conversationUuid,
    technicianId: clientInfo.technicianId,
    receivedAt: new Date(),
    text: msg.text,
  });

  return { type: 'send_message_success' };
}