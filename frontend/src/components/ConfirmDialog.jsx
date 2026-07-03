import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title = 'Confirmar',
  message = '¿Está seguro de que desea continuar?',
  closeOnCancel = true,
  closeOnConfirm = true,
}) {
  function handleCancel() {
    closeOnCancel && onClose?.();
    onCancel?.();
  }

  function handleConfirm() {
    closeOnConfirm && onClose?.();
    onConfirm?.();
  }

  return <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      {message}
    </DialogContent>

    <DialogActions>
      <Button onClick={handleConfirm} color="error" variant="contained">
        Confirmar
      </Button>

      <Button onClick={handleCancel} color="inherit">
        Cancelar
      </Button>
    </DialogActions>
  </Dialog>;
}
