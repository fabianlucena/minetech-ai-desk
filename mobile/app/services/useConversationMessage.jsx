import { useCallback } from 'react';
import useApi from './useApi';

export default function useConversationMessages() {
  const api = useApi();

  function normalizeConversationMessage(msg) {
    msg ??= {};
    if (msg.receivedAt) msg.receivedAt = new Date(msg.receivedAt);
    if (msg.sentAt) msg.sentAt = new Date(msg.sentAt);
    if (msg.deliveredAt) msg.deliveredAt = new Date(msg.deliveredAt);
    if (msg.readAt) msg.readAt = new Date(msg.readAt);
    if (msg.failedAt) msg.failedAt = new Date(msg.failedAt);

    return msg;
  }

  const getConversationMessages = useCallback(async (uuid, params) => {
    const messages = await api.getJson(`v1/conversations/${uuid}/messages`, { ...params });
    return messages.map(normalizeConversationMessage);
  }, [api]);

  return {
    normalizeConversationMessage,
    getConversationMessages,
  };
}