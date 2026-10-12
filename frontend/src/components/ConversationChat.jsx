import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import React from 'react';
import MessageBubble from './MessageBubble.jsx';
import ChatDateSeparator from './ChatDateSeparator.jsx';
import { formatTime } from '../utils/datetime.js';

export default function ConversationChat({
  messages,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return <Box
    sx={{
      overflowY: 'auto',
      p: 2,
      flexGrow: 1,
    }}
  >
    {messages.map((msg, index) => {
      const currentDate = new Date(msg.receivedAt || msg.timestamp).toDateString();
      const prevDate = index > 0
        ? new Date(messages[index - 1].receivedAt || messages[index - 1].timestamp).toDateString()
        : null;
      const showDateSeparator = currentDate !== prevDate;
      
      return <React.Fragment key={msg.uuid}>
        {showDateSeparator && <ChatDateSeparator date={msg.receivedAt || msg.timestamp} />}

        <MessageBubble
          {...msg}
          timestamp={formatTime(msg.receivedAt || msg.timestamp)}
        />
      </React.Fragment>
    })}

    <div ref={bottomRef} />
  </Box>;
}
