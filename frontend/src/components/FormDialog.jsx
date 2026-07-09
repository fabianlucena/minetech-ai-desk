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
      onCancel={() => {
        onCancel?.();
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </Form>
  </Dialog>;
}