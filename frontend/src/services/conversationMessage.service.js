import Api from '../utils/api.js';
import { wsUrl } from '../config.js';

export function normalizeReceivedMessage(msg) {
  msg ??= {};
  if (msg.receivedAt) msg.receivedAt = new Date(msg.receivedAt);
  if (msg.sentAt) msg.sentAt = new Date(msg.sentAt);
  if (msg.deliveredAt) msg.deliveredAt = new Date(msg.deliveredAt);
  if (msg.readAt) msg.readAt = new Date(msg.readAt);
  if (msg.failedAt) msg.failedAt = new Date(msg.failedAt);

  return msg;
}

export async function getConversationMessages(uuid, params) {
  const messages = await Api.getJson(`v1/conversations/${uuid}/messages`, params);
  return messages.map(normalizeReceivedMessage);
}

export async function connectToChat(uuid, handler) {
  const ws = new WebSocket(wsUrl + `/chat/${uuid}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'auth',
      token: Api.authorizationToken
    }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handler?.(msg);
  };

  ws.onclose = () => {
    console.log('WS closed');
  };

  ws.onerror = (err) => {
    console.error('WS error:', err);
  };

  return ws;
}