import Api from '../utils/api.js';

export async function getConversations(params) {
  return await Api.getJson('v1/conversations', params);
}

export async function getConversation(uuid, params) {
  return await Api.getJson(`v1/conversations/${uuid}`, params);
}

export async function deleteConversation(uuid) {
  return await Api.deleteJson(`v1/conversations/${uuid}`);
}

export async function restoreConversation(uuid) {
  return await Api.patchJson(`v1/conversations/${uuid}/restore`);
}

export async function closeConversation(uuid) {
  return await Api.patchJson(`v1/conversations/${uuid}/close`);
}