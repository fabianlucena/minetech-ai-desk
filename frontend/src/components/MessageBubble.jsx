import { Box, Typography } from '@mui/material';
import MessageStatusIcon from './icons/MessageStatusIcon';

export default function MessageBubble({
  text,
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
        bgcolor: isMine ? '#114433' : 
          status.senderType === 'user' ? '#114433' : 
          status.senderType === 'ia' ? '#1b465f' : '#2A2A2A',
        color: '#EEE',
        p: 1.2,
        borderRadius: 2,
        boxShadow: 1,
        minWidth: '20%',
      }}
    >
      {!isMine && <Typography
        variant="caption"
        sx={{
          fontWeight: 900,
          size: 8,
          display: 'block',
          color: '#aaa',
          mb: 0.5,
        }}
      >
        {status.sender?.displayName || status.senderType === 'ia' && 'Minetech IA' || 'Desconocido'}
      </Typography>}
      <Typography variant="body2">{text}</Typography>
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