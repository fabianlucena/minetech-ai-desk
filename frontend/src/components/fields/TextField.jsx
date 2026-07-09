import { TextField as MuiTextField, Box } from '@mui/material';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';

export default function TextField({
  tools,
  children,
  variant = 'outlined',
  sx = {},
  ...props
}) {
  if (variant === 'standard') {
    sx = {...sx};
    sx['& .MuiInput-underline:before'] = {
      borderBottom: 'none',
      ...sx['& .MuiInput-underline:before'],
    };
    sx['& .MuiInput-underline:after'] = {
      borderBottom: 'none',
      ...sx['& .MuiInput-underline:after'],
    };
  }

  return <Box 
    sx={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <MuiTextField
      fullWidth
      variant={variant}
      sx={sx}
      {...props}
    >
      {children}
    </MuiTextField>
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