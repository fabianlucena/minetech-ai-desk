import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Chat from '../components/ConversationChat.jsx';
import { ReloadButton } from '../components/buttons';
import useConversation from '../services/useConversation';
import useConversationMessage from '../services/useConversationMessage';
import { formatRelativeDateTime } from '../utils/datetime.js';
import { ConnectedIcon, DisconnectedIcon } from '../components/icons/index.jsx';

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
  const { getConversationMessages, connectToChat, normalizeConversationMessage } = useConversationMessage();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const wsTimeout = useRef(1500);

  const connect = useCallback(() => {
    console.log('Connecting to chat...');

    if (ws.current)
      return;
    
    const newWs = connectToChat(uuid, (msg) => {
      if (msg.type === 'chat_message') {
        const message = normalizeConversationMessage(msg.message);
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

    newWs.ref = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newWs.onclose = () => {
      console.log('WebSocket connection closed.');

      if (ws.current && ws.current.ref === newWs.ref)
        ws.current = null;

      if (wsTimeout.current) {
        console.log('Reconnecting...');
        setTimeout(connect, wsTimeout.current);
      }
    };

    ws.current = newWs;

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wsTimeout.current = 1500;
    connect();
    
    return () => {
      wsTimeout.current = 0;
      if (!ws.current)
        return;

      if (ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.onopen = () => ws.current.close(1000, 'Conexión cerrada por el cliente');
      }

      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Conexión cerrada por el cliente');
      }
    }
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
    setMessages(messages
      .map(normalizeMessageToShow)
      .sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime())
    );
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
        {ws ? <ConnectedIcon /> : <DisconnectedIcon />}
        <ReloadButton onClick={handleReload} />
      </Box>
    </Box>
    <Chat messages={messages} />
  </Box>;
}