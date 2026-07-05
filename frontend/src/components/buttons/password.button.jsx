import IconButton from '@mui/material/IconButton';
import KeyIcon from '@mui/icons-material/KeyTwoTone';

export default function PasswordButton(props) {
  return <IconButton
    {...{title: 'Cambiar contraseña', ...props}}
  >
    <KeyIcon />
  </IconButton>;
}
