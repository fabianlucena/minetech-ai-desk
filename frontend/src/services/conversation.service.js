import Api from '../utils/api.js';

export async function getConversations(params) {
  return await Api.getJson('v1/conversations', params);
}

export async function getConversation(uuid, params) {
  return await Api.getJson(`v1/conversations/${uuid}`, params);
}

export async function createConversation(data) {
  return await Api.postJson('v1/conversations', { body: data });
}

export async function updateConversation(uuid, data) {
  return await Api.putJson(`v1/conversations/${uuid}`, { body: data });
}

export async function deleteConversation(uuid) {
  return await Api.deleteJson(`v1/conversations/${uuid}`);
}

export async function restoreConversation(uuid) {
  return await Api.patchJson(`v1/conversations/${uuid}/restore`);
}