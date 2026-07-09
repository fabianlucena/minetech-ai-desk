import { Dialog } from '@mui/material';
import Form from './Form';

export default function FormDialog({
  title = '',
  children,
  open,
  setOpen = () => {},
  onCancel,
  ...props
}) {
  return <Dialog
    open={open}
    onClose={() => setOpen(false)}
  >
    <Form
      title={title}
      onCancel={(...args) => {
        onCancel?.(...args);
        setOpen(false);
      }}
      onSubmit={(e, ...args) => {
        e.preventDefault();
        onSubmit?.(e, ...args);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </Form>
  </Dialog>;
}