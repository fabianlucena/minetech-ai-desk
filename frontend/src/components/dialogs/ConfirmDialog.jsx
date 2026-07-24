import Dialog from './Dialog';

export default function ConfirmDialog({
  title = 'Confirmar',
  defaultContent = '¿Está seguro de que desea continuar?',
  onClose,
  onCancel = (e) => onClose?.(e),
  ...rest
}) {
  return <Dialog
    title={title}
    defaultContent={defaultContent}
    onClose={onClose}
    onCancel={onCancel}
    {...rest}
  />;
}
