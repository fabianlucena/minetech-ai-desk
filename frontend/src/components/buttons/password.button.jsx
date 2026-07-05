import KeyIcon from '@mui/icons-material/KeyTwoTone';

export default function PasswordButton(props) {
  return <button {...{title: 'Cambiar contraseña', ...props}}>
    <KeyIcon />
  </button>;
}
