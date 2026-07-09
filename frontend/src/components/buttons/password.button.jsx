import IconButton from './IconButton';
import Icon from '@mui/icons-material/KeyTwoTone';

export default function PasswordButton(props) {
  return <IconButton
    title='Cambiar contraseña'
    Icon={Icon}
    {...props}
  />;
}