import { Snackbar as MuiSnackbar, Alert, Button } from '@mui/material';
import { useState } from 'react';

export default function Snackbar({
  title,
  text,
  severity = 'success',
  variant = 'filled',
  autoHideDuration = 4000
}) {
  const [open, setOpen] = useState(true);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return <>
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
      >
        {text}
      </Alert>
    </MuiSnackbar>
  </>;
}
