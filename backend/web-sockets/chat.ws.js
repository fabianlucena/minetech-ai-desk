import { tryParseJSON } from '../utils/json.js';
import { getDependency } from '../dependency.js';
import { WSFatalError, WSError } from './WSError.js';

const config = getDependency('config');
const logger = getDependency('logger');
let technicianService;
let sessionService;
let conversationService;

const clients = new Map();

export default function configureConversationMessagesWebSocketHandler(ws) {
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
        const clientInfo = clients.get(ws);
        if (!clientInfo || !clientInfo.session || clientInfo.errorCount >= config.maxWSErrorCount)
          throw new WSFatalError(1007, 'El JSON recibido es inválido');

        clientInfo.errorCount = (clientInfo.errorCount || 0) + 1;
        throw new WSError('El JSON recibido es inválido');
      } else {
        const clientInfo = clients.get(ws);
        if (clientInfo)
          clientInfo.errorCount = 0;
      }
      
      if (msg.type === 'auth') 
        res = await handleAuth({msg, ws});
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
    clients.delete(ws);
  });
}

export function sendToTechnicianId(technicianId, message) {
  if (typeof message !== 'string')
    message = JSON.stringify(message);

  const filteredClients = [...clients.entries()]
    .filter(([, info]) => info && info.technicianId === technicianId);
  for (const [ws] of filteredClients) {
    try {
      ws.send(message);
    } catch (err) {
      clients.delete(ws);
      logger.warn(`Failed to send WS message to technicianId=${technicianId}: ${err.message}`);
    }
  }
}

async function handleAuth({msg, ws}) {
  if (!msg.token)
    throw new WSFatalError(1008, 'Falta el token de autorización');

  const session = await sessionService.getByAuthorizationToken(msg.token);
  if (!session)
    throw new WSFatalError(1008, 'Token de autorización inválido');

  if (session.closedAt)
    throw new WSFatalError(1008, 'La sesión está cerrada');

  if (session.expiresAt < new Date())
    throw new WSFatalError(1008, 'La sesión ha expirado');

  const technician = await technicianService.getById(session.userId);

  clients.set(ws, { session, technicianId: technician?.id, errorCount: 0 });

  return { type: 'auth_success' };
}

async function handleSendMessage({msg, ws}) {
  if (!clients.has(ws))
    throw new WSError('Cliente no autenticado');

  const clientInfo = clients.get(ws);
  if (!clientInfo.session)
    throw new WSError('Cliente no autenticado');

  if (!clientInfo.technicianId)
    throw new WSError('El cliente no es un técnico');

  if (!msg.conversationUuid)
    throw new WSError('Conversación no especificada');

  await conversationService.addTechnicianMessage({
    conversationUuid: msg.conversationUuid,
    technicianId: clientInfo.technicianId,
    sentAt: new Date(),
    text: msg.text,
  });

  return { type: 'send_message_success' };
}