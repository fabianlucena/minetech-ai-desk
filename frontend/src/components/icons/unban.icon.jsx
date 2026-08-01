import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CheckCircleTwoTone';

export default function UnbanIcon(props) {
  return <Tooltip title={props.title || 'Desbanear'}>
      <Icon {...props} />
    </Tooltip>;
}
