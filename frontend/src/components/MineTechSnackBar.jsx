import { Snackbar, Alert, Button } from '@mui/material';
import { useState } from 'react';

export default function MineTechSnackbar() {
  const [open, setOpen] = useState(true);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return <>
    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
      Guardar cambios
    </Button>

    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        Cambios guardados correctamente
      </Alert>
    </Snackbar>
  </>;
}
