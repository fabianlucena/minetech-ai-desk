import { Dialog } from '@mui/material';
import Form from './Form';

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
  return <Dialog
    open={open}
  >
    <Form
      unchangedData={unchangedData}
      title={title}
      onSubmit={(e, ...args) => {
        e.preventDefault();
        onSubmit?.(e, ...args);
        onClose?.();
      }}
      onCancel={e => onCancel?.(e) || onClose?.(e)}
      {...props}
    >
      {children}
    </Form>
  </Dialog>;
}