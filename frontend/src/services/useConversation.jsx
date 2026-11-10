import { useCallback, useMemo } from 'react';
import useApi from './useApi';

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

export default function useConversation() {
  const api = useApi();

  const getConversations = useCallback((params) => api.getJson('v1/conversations', { normalizeItem: normalizeConversation, ...params }), [api]);
  const getConversation = useCallback((uuid, params) => api.getJson(`v1/conversations/${uuid}`, { normalizeItem: normalizeConversation, ...params }), [api]);
  const deleteConversation = useCallback((uuid) => api.deleteJson(`v1/conversations/${uuid}`), [api]);
  const restoreConversation = useCallback((uuid) => api.patchJson(`v1/conversations/${uuid}/restore`), [api]);
  const closeConversation = useCallback((uuid) => api.patchJson(`v1/conversations/${uuid}/close`), [api]);

  return useMemo(() => ({
    normalizeConversation,
    getConversations,
    getConversation,
    deleteConversation,
    restoreConversation,
    closeConversation,
  }), [getConversations, getConversation, deleteConversation, restoreConversation, closeConversation]);
}