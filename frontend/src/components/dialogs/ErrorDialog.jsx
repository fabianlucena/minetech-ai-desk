import Dialog from './Dialog';

export default function ErrorDialog({
  title = 'Error',
  children = 'Ha ocurrido un error.',
  ...rest
}) {
  return <Dialog
    title={title}
    {...rest}
  >
    {children}
  </Dialog>;
}
