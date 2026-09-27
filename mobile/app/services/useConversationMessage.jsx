import { useCallback, useMemo } from 'react';
import useApi from './useApi';

function normalizeConversationMessage(msg) {
  msg ??= {};
  if (msg.receivedAt) msg.receivedAt = new Date(msg.receivedAt);
  if (msg.sentAt) msg.sentAt = new Date(msg.sentAt);
  if (msg.deliveredAt) msg.deliveredAt = new Date(msg.deliveredAt);
  if (msg.readAt) msg.readAt = new Date(msg.readAt);
  if (msg.failedAt) msg.failedAt = new Date(msg.failedAt);

  return msg;
}

export default function useConversationMessages() {
  const api = useApi();

  const getConversationMessages = useCallback(async (uuid, params) => {
    const messages = await api.getJson(`v1/conversations/${uuid}/messages`, { ...params });
    return messages.map(normalizeConversationMessage);
  }, [api]);

  const value = useMemo(() => ({
    normalizeConversationMessage,
    getConversationMessages,
  }), [getConversationMessages]);

  return value;
}