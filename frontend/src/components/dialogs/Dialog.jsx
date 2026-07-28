import { useEffect, useRef } from 'react';
import { Dialog as MUIDialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import Button from '../buttons/Button.jsx';

export default function Dialog({
  open,
  onYes,
  yesText = 'Sí',
  onNo,
  noText = 'No',
  onConfirm,
  onOk,
  okText = 'Aceptar',
  confirmText = 'Confirmar',
  onCancel,
  cancelText = 'Cancelar',
  onClose,
  closeText = 'Cerrar',
  title = '',
  message = '',
  content = '',
  defaultContent = '',
  children,
  submitOnEnter = true,
  closeOnYes = true,
  closeOnNo = true,
  closeOnOk = true,
  closeOnConfirm = true,
  closeOnCancel = true,
  closeOnEscape = true,
}) {
  const formRef = useRef(null);

  useEffect(() => {
    if (open)
      setTimeout(() => formRef.current?.focus(), 0);
  }, [open]);

  function handleYes(event) {
    event.preventDefault();
    onYes?.(event);
    if (closeOnYes && onClose)
      onClose(event);
  }

  function handleNo(event) {
    event.preventDefault();
    onNo?.(event);
    if (closeOnNo && onClose)
      onClose(event);
  }

  function handleOk(event) {
    event.preventDefault();
    onOk?.(event);
    if (closeOnOk && onClose)
      onClose(event);
  }

  function handleCancel(event) {
    event.preventDefault();
    onCancel?.(event);
    if (closeOnCancel && onClose)
      onClose(event);
  }

  function handleConfirm(event) {
    event.preventDefault();
    onConfirm?.(event);
    if (closeOnConfirm && onClose)
      onClose(event);
  }

  function handleClose(event) {
    event.preventDefault();
    onClose?.(event);
  }

  function handleSubmit (event) {
    if (submitOnEnter) {
      if (onOk)
        handleOk(event);
      else if (onConfirm)
        handleConfirm(event);
      else if (onYes)
        handleYes(event);
      else if (onNo)
        handleNo(event);
      else if (onCancel)
        handleCancel(event);
      else if (onClose)
        handleClose(event);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      if (closeOnEscape)
        handleClose(event);
    } else if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  return <MUIDialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle>{title}</DialogTitle>

    <DialogContent>
      {message}
      {children}
      {content}
      {!message && !content && !children && defaultContent}
    </DialogContent>

    <DialogActions>
      <form
        onSubmit={handleSubmit}
      >
        <Stack
          ref={formRef}
          tabIndex={0}
          direction="row"
          spacing={1}
          onKeyDown={handleKeyDown}
          style={{
            outline: 'none',
            justifyContent: 'flex-end',
          }}
        >
          {onCancel && <Button secondary onClick={handleCancel} >
            {cancelText || 'Cancelar'}
          </Button>}

          {onNo && <Button secondary onClick={handleNo} >
            {noText || 'No'}
          </Button>}

          {onYes && <Button primary={!onOk && !onConfirm} onClick={handleYes} >
            {yesText || 'Sí'}
          </Button>}

          {onConfirm && <Button primary={!onOk} onClick={handleConfirm} >
            {confirmText || 'Confirmar'}
          </Button>}

          {onOk && <Button primary onClick={handleOk} >
            {okText || 'Aceptar'}
          </Button>}

          {!onYes && !onNo && !onOk && !onConfirm && !onCancel && <Button primary onClick={handleClose} >
            {closeText || 'Cerrar'}
          </Button>}
        </Stack>
      </form>
    </DialogActions>
  </MUIDialog>;
}
