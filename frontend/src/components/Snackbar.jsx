import { Snackbar as MuiSnackbar, Alert, Button, Slide } from '@mui/material';
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

  return <Slide
    direction="up"
    in={open}
  >
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
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
  </Slide>;
}
