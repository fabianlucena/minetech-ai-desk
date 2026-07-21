import { Dialog as MUIDialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Dialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title = '',
  message = '',
  content = '',
  children,
  closeOnCancel = true,
  closeOnConfirm = true,
}) {
  function handleCancel(event) {
    if (closeOnCancel && onClose)
      onClose(event);

    onCancel?.(event);
  }

  function handleConfirm(event) {
    if (closeOnConfirm && onClose)
      onClose(event);

    onConfirm?.(event);
  }

  return <MUIDialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      {message}
      {children}
      {content}
    </DialogContent>

    <DialogActions>
      {onConfirm && <Button onClick={handleConfirm} color="error" variant="contained">
        Confirmar
      </Button>}

      {onCancel && <Button onClick={handleCancel} color="inherit">
        Cancelar
      </Button>}

      {!onConfirm && !onCancel && <Button onClick={onClose} color="inherit">
        Cerrar
      </Button>}
    </DialogActions>
  </MUIDialog>;
}
