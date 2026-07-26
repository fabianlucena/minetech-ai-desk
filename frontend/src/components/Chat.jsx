import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import React from 'react';
import MessageBubble from './MessageBubble.jsx';
import DateSeparator from './ChatDateSeparator.jsx';
import { formatTime } from '../utils/datetime.js';

export default function ConversationChat({
  messages,
}) {
  const bottomRef = useRef(null);
  let lastDate = null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return <Box
    sx={{
      overflowY: 'auto',
      p: 2,
      bgcolor: '#9c9993',
      flexGrow: 1,
    }}
  >
    {messages.map((msg) => {
      const msgDate = new Date(msg.timestamp).toDateString();
      const showSeparator = msgDate !== lastDate;
      lastDate = msgDate;

      return <React.Fragment key={msg.id}>
        {showSeparator && <DateSeparator date={msg.timestamp} />}

        <MessageBubble
          {...msg}
          timestamp={formatTime(msg.timestamp)}
        />
      </React.Fragment>
    })}

    <div ref={bottomRef} />
  </Box>;
}
