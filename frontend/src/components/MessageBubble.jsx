import { Box, Typography } from '@mui/material';
import MessageStatusIcon from './icons/MessageStatusIcon';

export default function MessageBubble({
  message,
  isMine,
  timestamp,
  ...status
}) {
  return <Box
    sx={{
      display: 'flex',
      justifyContent: isMine ? 'flex-end' : 'flex-start',
      mb: 1,
    }}
  >
    <Box
      sx={{
        maxWidth: '70%',
        bgcolor: isMine ? '#DCF8C6' : '#FFFFFF',
        color: '#000',
        p: 1.2,
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="body2">{message}</Typography>
      <Typography
        variant="caption"
        sx={{ display: 'block', textAlign: 'right', opacity: 0.6 }}
      >
        {timestamp}
        <MessageStatusIcon {...status} />
      </Typography>
    </Box>
  </Box>;
}