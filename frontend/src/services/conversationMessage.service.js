import Api from '../utils/api.js';

export async function getConversationMessages(uuid, params) {
  return await Api.getJson(`v1/conversations/${uuid}/messages`, params);
}