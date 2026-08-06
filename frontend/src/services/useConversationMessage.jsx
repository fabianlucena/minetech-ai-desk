import { useCallback } from 'react';
import useApi from './useApi';
import { wsUrl } from '../config.js';

export default function useConversation() {
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

  const connectToChat = useCallback(async (uuid, handler) => {
    const ws = new WebSocket(wsUrl + `/chat/${uuid}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'auth',
        token: api.authorizationToken
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
  }, [api]);

  const getConversationMessages = useCallback(async (uuid, params) => {
    const messages = await api.getJson(`v1/conversations/${uuid}/messages`, { ...params });
    return messages.map(normalizeConversationMessage);
  }, [api]);

  return {
    normalizeConversationMessage,
    connectToChat,
    getConversationMessages,
  };
}