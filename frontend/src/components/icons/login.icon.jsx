import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/LoginTwoTone';

export default function LoginIcon(props) {
  return <Tooltip title={props.title || 'Ingresar'}>
      <Icon {...props} />
    </Tooltip>;
}
