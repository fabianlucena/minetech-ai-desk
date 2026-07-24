import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Stack, CircularProgress } from '@mui/material';
import Button from './buttons/Button.jsx';
import ConfirmDialog from './dialogs/ConfirmDialog.jsx';

export default function Form({
  title,
  titleTools,
  description,
  footer,
  children,
  canSubmit = true,
  validationError,
  unchangedData = false,
  onSubmit,
  submitText = 'Enviar',
  onCancel,
  cancelText = 'Cancelar',
  onCancelGoBack,
  onEscape,
  cancelOnEscape = true,
  disabled,
  disabledMessage = 'Procesando...',
  cancelConfirmTitle = 'Hay cambios sin guardar',
  cancelConfirmMessage = '¿Está seguro de que desea cancelar? Se perderán los cambios realizados.',
  cancelConfirmText = 'Cancelar edición',
  cancelCancelText = 'Continuar editando',
  submitConfirmTitle = '¿Está seguro de que desea enviar?',
  submitConfirmMessage = 'Una vez enviado, no podrá deshacer los cambios.',
  submitConfirmText = 'Enviar',
  submitCancelText = 'Cancelar',
  sx,
}) {
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onClose: () => setConfirmDialog({ ...confirmDialog, open: false }),
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (!submitConfirmMessage) {
      onSubmit?.(event);
      return;
    }

    setConfirmDialog(data => ({
      ...data,
      title: submitConfirmTitle,
      message: submitConfirmMessage,
      confirmText: submitConfirmText,
      cancelText: submitCancelText,
      open: true,
      onConfirm: () => onSubmit?.(event),
    }));
  }

  function handleCancel(event, callback) {
    if (unchangedData) {
      callback(event);
      return;
    }

    setConfirmDialog(data => ({
      ...data,
      title: cancelConfirmTitle,
      message: cancelConfirmMessage,
      confirmText: cancelConfirmText,
      cancelText: cancelCancelText,
      open: true,
      onConfirm: () => callback(event),
    }));
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      handleEscape(event);
    }
  }

  function handleEscape(event) {
    event.preventDefault();
    onEscape?.(event);
    if (event.defaultPrevented && cancelOnEscape) {
      handleCancel(event, () => navigate(-1));
    }
  }

  return <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      ...sx,
    }}
  >
    <ConfirmDialog {...confirmDialog} />
    {disabled && <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(63, 63, 63, 0.8)',
        display: 'flex',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        flexDirection: 'column',
      }}
    >
      <CircularProgress
        size={32}
        color="primary"
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {disabledMessage}
      </Typography>
    </Box>}

    {(title || titleTools || description) && <Box>
      {(title || titleTools) && <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {title && <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>}
        {titleTools && <Box>
          {titleTools}
        </Box>}
      </Box>}
      {description && <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>}
    </Box>}

    <Typography
      variant="body2"
      color={validationError ? 'error' : unchangedData ? 'warning' : 'text.secondary' }
    >
      {validationError || (unchangedData ? 'No se han realizado cambios' : 'Listo para enviar')}
    </Typography>

    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <Stack spacing={2}>
        {children}
      </Stack>

      {(footer || onSubmit || submitText || onCancel || onCancelGoBack) && <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        {footer}
        {(onCancel) && <Button secondary onClick={e => handleCancel(e, onCancel)}>
          {cancelText || 'Cancelar'}
        </Button>}
        {(onCancelGoBack) && <Button secondary onClick={e => handleCancel(e, () => navigate(-1))}>
          {cancelText || 'Cancelar'}
        </Button>}
        {(onSubmit || submitText) && <Button type="submit" disabled={!canSubmit || validationError || unchangedData || disabled}>
          {submitText || 'Enviar'}
        </Button>}
      </Box> }
    </form>
  </Paper>;
}