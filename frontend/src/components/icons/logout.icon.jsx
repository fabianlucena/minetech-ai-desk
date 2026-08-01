import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/LogoutTwoTone';

export default function LogoutIcon(props) {
  return <Tooltip title={props.title || 'Cerrar sesión'}>
      <Icon {...props} />
    </Tooltip>;
}
