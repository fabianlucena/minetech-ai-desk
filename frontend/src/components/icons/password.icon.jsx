import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/KeyTwoTone';

export default function PasswordIcon(props) {
  return <Tooltip title={props.title || 'Cambiar contraseña'}>
      <Icon {...props} />
    </Tooltip>;
}
