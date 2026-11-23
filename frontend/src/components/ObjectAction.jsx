import { Box } from '@mui/material';

export default function ObjectAction({
  icon,
  label,
  onClick,
  ...props
}) {
  return <Box
    onClick={onClick}
    title={label}
    {...props}
    sx={{
      padding: '0.1em',
      borderRadius: '0.3em',
      border: '1px solid rgba(0, 0, 0, 0)',
      '&:hover': {
        cursor: 'pointer',
        borderColor: '#7373e9',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        boxShadow: '0 0 5px #1a036da3',
      },
    }}
  >
    {icon}
  </Box>;
}