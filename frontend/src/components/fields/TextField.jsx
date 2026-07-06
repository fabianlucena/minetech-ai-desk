import { TextField as MuiTextField, Box } from '@mui/material';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';

export default function TextField({ tools, ...props }) {
  return <Box 
    fullWidth
    sx={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <MuiTextField
      fullWidth
      {...props}
    />
    {tools && <Box
      sx={{
        right: 4,
        position: 'absolute',
        textAlign: 'right',
      }}
    >
      {tools}
    </Box>}
  </Box >
}