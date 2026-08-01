import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/PeopleTwoTone';

export default function UsersIcon(props) {
  return <Tooltip title={props.title || 'Usuarios'}>
      <Icon {...props} />
    </Tooltip>;
}
