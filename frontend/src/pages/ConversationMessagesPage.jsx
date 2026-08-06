import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Chat from '../components/ConversationChat.jsx';
import { ReloadButton } from '../components/buttons';
import useConversation from '../services/useConversation';
import useConversationMessage from '../services/useConversationMessage';
import { formatRelativeDateTime } from '../utils/datetime.js';

function normalizeMessageToShow(msg) {
  msg.id ??= msg.uuid;
  msg.timestamp ??= msg.receivedAt;
  msg.message ??= msg.text;
  msg.isMine ??= msg.senderType !== 'requester';

  return msg;
}

export default function ConversationMessagesPage() {
  const { uuid } = useParams();
  const { getConversation } = useConversation();
  const { getConversationMessages, connectToChat } = useConversationMessage();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = connectToChat(uuid, (msg) => {
      if (msg.type === 'chat_message') {
        const message = normalizeReceivedMessage(msg.message);
        setMessages(messages => {
          const exists = messages.some(m => m.uuid === message.uuid);

          if (exists) {
            return messages.map(m =>
              m.uuid === message.uuid
                ? {
                    ...m,
                    ...message,
                  }
                : m
            );
          }

          return [
            ...messages,
            normalizeMessageToShow(message),
          ].sort((a, b) => a.timestamp - b.timestamp);
        });
      }
    });

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'Conexión cerrada por el cliente');
      }
    }
  }, [uuid, getConversationMessages, connectToChat]);

  const fetchConversation = useCallback(async () => {
    try {
      const conversationData = await getConversation(uuid);
      setConversation(conversationData);
    } catch (error) {
      console.error('Error al obtener la conversación:', error);
      setConversation(null);
    }
  }, [uuid, getConversation]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const fetchMessages = useCallback(async () => {
    const messages = await getConversationMessages(uuid);
    setMessages(messages.map(normalizeMessageToShow));
  }, [uuid, getConversationMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function handleReload() {
    fetchConversation();
    fetchMessages();
  }

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function handleReload() {
    fetchConversation();
    fetchMessages();
  }

  return <Box
    sx={{
      height: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f0f0f0',
      p: 2,
      margin: 0,
      padding: 0,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={600}>
          Conversación
        </Typography>
        {conversation?.requester?.displayName && (
          <Typography variant="body2" color="text.secondary">
            Solicitante: {conversation?.requester?.displayName}
          </Typography>
        )}
        {conversation?.client?.name && (
          <Typography variant="body2" color="text.secondary">
            Cliente: {conversation?.client?.name}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {`De: ${formatRelativeDateTime(conversation?.createdAt)} a ${formatRelativeDateTime(conversation?.lastMessageAt)}`}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 1 }}>
        <ReloadButton onClick={handleReload} />
      </Box>
    </Box>
    <Chat messages={messages} />
  </Box>;
}