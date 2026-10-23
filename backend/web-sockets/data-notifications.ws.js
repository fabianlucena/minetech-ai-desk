import { tryParseJSON } from '../utils/json.js';
import { getDependency } from '../dependency.js';
import { WSFatalError, WSError } from './WSError.js';

const config = getDependency('config');
const logger = getDependency('logger');
let sessionService;

const peers = new Map();

export const routes = {
  '/ws/data-notifications': handler,
};

export function init() {
  const dataNotificationService = getDependency('dataNotificationService');
  dataNotificationService.addListener(notification => {
    for (const [peerWs, peerData] of peers.entries()) {
      if (!peerData.session || !peerData.topics)
        continue;

      const topic = notification.topic;
      if (!topic || !peerData.topics.has(topic))
        continue;

      const message = {
        type: 'data_notification',
        topic,
        action: notification.action,
      };
      if (notification.uuid)
        message.uuid = notification.uuid;
      if (notification.uuids)
        message.uuids = notification.uuids;

      peerWs.send(JSON.stringify(message));
    }
  });
}

export function handler(ws) {
  sessionService = getDependency('sessionService');

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

      res = await handle({msg, ws});
    } catch (err) {
      if (err.code) {
        logger.error(`WS fatal error ('${err.code}'): ${err.message}, closing connection`);
        ws.close(err.code, err.message);
        return;
      } else {
        console.error('WS error:', err);
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

async function handle({msg, ws}) {
  if (msg.type === 'auth') 
    return await handleAuth({msg, ws});

  const topic = msg.topic;
  if (!topic)
    throw new WSError('Falta el tema al que se quiere suscribir o desuscribir las notificaciones');

  if (msg.type === 'subscribe')
    return await handleSubscribe({msg, ws, topic});
  else if (msg.type === 'unsubscribe')
    return await handleUnsubscribe({msg, ws, topic});

  throw new WSError('Tipo de mensaje desconocido');
}

async function handleAuth({msg, ws}) {
  if (!msg.token)
    throw new WSFatalError(1008, 'Falta el token de autorización');

  let session = await sessionService.getByAuthorizationToken(msg.token);
  if (!session)
    throw new WSFatalError(1008, 'Token de autorización inválido');

  if (session.closedAt)
    throw new WSFatalError(1008, 'La sesión está cerrada');

  if (session.expiresAt < new Date())
    throw new WSFatalError(1008, 'La sesión ha expirado');

  session = await sessionService.decorateWithCredentials(session);
  if (!session)
    throw new WSFatalError(1008, 'Error al decorar la sesión con credenciales');

  const peerData = {
    session,
    errorCount: 0,
  };

  peers.set(ws, peerData);
  return { type: 'auth_success' };
}

async function handleSubscribe({ws, topic}) {
  const peerData = peers.get(ws);
  if (!peerData || !peerData.session)
    throw new WSFatalError(1008, 'No se puede suscribir a un tema sin autenticación');

  if (!peerData.session.permissions || 
    (!peerData.session.permissionNames.includes(topic + '.list')
      && !peerData.session.permissionNames.includes(topic + '.read'))
  ) 
    return { type: 'subscribe_error', message: 'No tiene permisos para suscribirse al tema: ' + topic };

  peerData.topics = peerData.topics || new Set();
  peerData.topics.add(topic);

  return { type: 'subscribe_success' };
}

async function handleUnsubscribe({ws, topic}) {
  const peerData = peers.get(ws);
  if (!peerData || !peerData.session)
    throw new WSFatalError(1008, 'No se puede desuscribir de un tema sin autenticación');

  if (peerData.topics)
    peerData.topics.delete(topic);

  return { type: 'unsubscribe_success' };
}