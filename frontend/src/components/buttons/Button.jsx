import { Button as MUIButton } from '@mui/material';

export default function Button({
  variant,
  primary = false,
  secondary = false,
  default : defaultButton = false,
  className,
  type,
  ...props
}) {
  variant ??= secondary ?
    'outlined' :
    'contained';

  className ??= (primary || defaultButton || type === 'submit')?
    'default' :
    'primary';

  return <MUIButton
    className={className}
    variant={variant}
    type={type}
    {...props }
  />;
}