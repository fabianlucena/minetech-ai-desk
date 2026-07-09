import { Dialog as MUIDialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Dialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title = '',
  children,
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

  return <MUIDialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      {children}
    </DialogContent>

    <DialogActions>
      <Button onClick={handleConfirm} color="error" variant="contained">
        Confirmar
      </Button>

      <Button onClick={handleCancel} color="inherit">
        Cancelar
      </Button>
    </DialogActions>
  </MUIDialog>;
}
