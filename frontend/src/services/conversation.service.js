import Api from '../utils/api.js';

export async function getConversations(params) {
  const conversations = await Api.getJson('v1/conversations', params);
  return conversations.map(c => ({
    ...c,
    createdAt: c.createdAt ? new Date(c.createdAt) : null,
    lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt) : null,
    closedAt: c.closedAt ? new Date(c.closedAt) : null,
    deletedAt: c.deletedAt ? new Date(c.deletedAt) : null,
  }));
}

export async function getConversation(uuid, params) {
  const conversation = await Api.getJson(`v1/conversations/${uuid}`, params);
  return {
    ...conversation,
    createdAt: new Date(conversation.createdAt),
    lastMessageAt: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : null,
    closedAt: conversation.closedAt ? new Date(conversation.closedAt) : null,
    deletedAt: conversation.deletedAt ? new Date(conversation.deletedAt) : null,
  };
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