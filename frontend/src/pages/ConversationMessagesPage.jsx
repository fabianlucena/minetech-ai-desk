import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Chat from '../components/Chat.jsx';
import { ReloadButton } from '../components/buttons';
import { getConversation } from '../services/conversation.service.js';
import { getConversationMessages } from '../services/conversationMessage.service.js';
import { formatRelativeDateTime } from '../utils/datetime.js';

export default function ConversationMessagesPage() {
  const { uuid } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchConversation = useCallback(async () => {
    const conversationData = await getConversation(uuid);
    setConversation(conversationData);
  }, [uuid]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const fetchMessages = useCallback(async () => {
    const messages = await getConversationMessages(uuid);
    setMessages(messages.map(msg => ({
      id: msg.uuid,
      timestamp: msg.receivedAt,
      message: msg.text,
      isMine: msg.senderType !== 'requester',
    })));
  }, [uuid]);

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