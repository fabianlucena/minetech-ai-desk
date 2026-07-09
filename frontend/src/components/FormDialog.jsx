import { Dialog } from '@mui/material';
import Form from './Form';

export default function FormDialog({
  title = '',
  children,
  open,
  onCancel,
  onSubmit,
  onClose,
  ...props
}) {
  return <Dialog
    open={open}
    onClose={() => onClose?.(false)}
  >
    <Form
      title={title}
      onCancel={(...args) => {
        onCancel?.(...args);
        onClose?.();
      }}
      onSubmit={(e, ...args) => {
        e.preventDefault();
        onSubmit?.(e, ...args);
        onClose?.();
      }}
      {...props}
    >
      {children}
    </Form>
  </Dialog>;
}