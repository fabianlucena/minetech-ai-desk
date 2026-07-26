import Api from '../utils/api.js';

export async function getConversationMessages(uuid, params) {
  const messages = await Api.getJson(`v1/conversations/${uuid}/messages`, params);
  return messages.map(msg => ({
    ...msg,
    receivedAt: msg.receivedAt ? new Date(msg.receivedAt) : null,
    sentAt: msg.sentAt ? new Date(msg.sentAt) : null,
  }));
}