import useApi from './useApi';

export default function useConversation() {
  const api = useApi();

  function normalizeConversation(conversation) {
    if (!conversation)
      return null;

    return {
      ...conversation,
      createdAt: conversation.createdAt ? new Date(conversation.createdAt) : null,
      lastMessageAt: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : null,
      closedAt: conversation.closedAt ? new Date(conversation.closedAt) : null,
      deletedAt: conversation.deletedAt ? new Date(conversation.deletedAt) : null,
    }
  }

  return {
    normalizeConversation,
    getConversations: (params) => api.getJson('v1/conversations', { normalizeItem: normalizeConversation, ...params }),
    getConversation: (uuid, params) => api.getJson(`v1/conversations/${uuid}`, { normalizeItem: normalizeConversation, ...params }),
    deleteConversation: (uuid) => api.deleteJson(`v1/conversations/${uuid}`),
    restoreConversation: (uuid) => api.patchJson(`v1/conversations/${uuid}/restore`),
    closeConversation: (uuid) => api.patchJson(`v1/conversations/${uuid}/close`),
  };
}