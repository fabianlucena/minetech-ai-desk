import Dialog from './Dialog';

export default function ConfirmDialog({
  title = 'Confirmar',
  message = '¿Está seguro de que desea continuar?',
  ...rest
}) {
  return <Dialog
    title={title}
    message={message}
    {...rest}
  >
    {message}
  </Dialog>;
}
