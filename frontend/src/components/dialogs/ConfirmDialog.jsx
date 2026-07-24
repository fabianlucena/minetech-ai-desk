import Dialog from './Dialog';

export default function ConfirmDialog({
  title = 'Confirmar',
  children = '¿Está seguro de que desea continuar?',
  ...rest
}) {
  return <Dialog
    title={title}
    {...rest}
  >
    {children}
  </Dialog>;
}
