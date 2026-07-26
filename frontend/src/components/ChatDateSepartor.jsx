import { Box } from '@mui/material';
import { formatRelativeDate } from '../utils/datetime.js';

export default function DateSeparator({
  date,
}) {
  return <Box sx={{ textAlign: 'center', my: 2 }}>
    <Box
      sx={{
        display: 'inline-block',
        bgcolor: '#E1F3FB',
        color: '#555',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {formatRelativeDate(date)}
    </Box>
  </Box>;
}