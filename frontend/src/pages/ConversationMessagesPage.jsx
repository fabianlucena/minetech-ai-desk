import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getConversationMessages } from '../services/conversationMessage.service.js';

export default function ConversationMessagesPage() {
  const { uuid } = useParams();
  const [messages, setMessages] = useState([]);

  const fetchMessages = useCallback(async () => {
    const messages = await getConversationMessages(uuid);
    setMessages(messages);
  }, [uuid]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return <div>{uuid}
    {messages.map((message) => (
      <div key={message.id}>{message.text}</div>
    ))}
  </div>;
}