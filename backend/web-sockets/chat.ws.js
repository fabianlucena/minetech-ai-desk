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
          throw new WSFatalError(1007, 'Invalid JSON received');

        clientInfo.errorCount = (clientInfo.errorCount || 0) + 1;
        throw new WSError('Invalid JSON received');
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
        throw new WSError('Unknown message type');
    } catch (err) {
      if (err.code) {
        logger.error(`WS fatal error ('${err.code}'): ${err.message}, closing connection`);
        ws.close(1008, err.message);
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
    ws.send(message);
  }
}

async function handleAuth({msg, ws}) {
  if (!msg.token)
    throw new WSFatalError(1008, 'Authorization token is missing');

  const session = await sessionService.getByAuthorizationToken(msg.token);
  if (!session)
    throw new WSFatalError(1008, 'Invalid authorization token');

  if (session.closedAt)
    throw new WSFatalError(1008, 'Session has been closed');

  if (session.expiresAt < new Date())
    throw new WSFatalError(1008, 'Session has expired');

  const technician = await technicianService.getById(session.userId);

  clients.set(ws, { session, technicianId: technician?.id, errorCount: 0 });

  return { type: 'auth_success' };
}

async function handleSendMessage({msg, ws}) {
  if (!clients.has(ws))
    throw new WSError('Client is not authenticated');

  const clientInfo = clients.get(ws);
  if (!clientInfo.session)
    throw new WSError('Client is not authenticated');

  if (!clientInfo.technicianId)
    throw new WSError('Client is not a technician');

  if (!msg.conversationUuid)
    throw new WSError('Conversation is not specified');

  await conversationService.addTechnicianMessage({
    conversationUuid: msg.conversationUuid,
    technicianId: clientInfo.technicianId,
    sentAt: new Date(),
    text: msg.text,
  });

  return { type: 'send_message_success' };
}