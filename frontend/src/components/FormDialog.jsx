import { useState } from 'react';
import { Dialog } from '@mui/material';
import Form from './Form';
import { CloseButton } from './buttons';
import ConfirmDialog from './dialogs/ConfirmDialog';

export default function FormDialog({
  title = '',
  children,
  open,
  onCancel,
  onSubmit,
  onClose,
  unchangedData = false,
  ...props
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleCancel(...args) {
    if (unchangedData) {
      onCancel?.(...args);
      onClose?.();
    } else {
      setConfirmOpen(true);
    }
  }

  return <>
    <ConfirmDialog
      title="Confirmar cancelación"
      content="¿Está seguro de que desea cancelar? Se perderán los cambios no guardados."
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={() => {
        onCancel?.();
        onClose?.();
        setConfirmOpen(false);
      }}
    />
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <Form
        unchangedData={unchangedData}
        title={title}
        titleTools={<>
          <CloseButton onClick={handleCancel}/>
        </>}
        onCancel={handleCancel}
        onSubmit={(e, ...args) => {
          e.preventDefault();
          onSubmit?.(e, ...args);
          onClose?.();
        }}
        {...props}
      >
        {children}
      </Form>
    </Dialog>
  </>;
}