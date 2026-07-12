import Dialog from './Dialog';

export default function ConfirmDialog({
  title = 'Confirmar',
  content = '¿Está seguro de que desea continuar?',
  message = '',
  ...rest
}) {
  return <Dialog
    title={title}
    {...rest}
  >
    {content || message}
  </Dialog>;
}
