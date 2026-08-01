import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/BusinessCenterTwoTone';

export default function ClientIcon(props) {
  return <Tooltip title={props.title || 'Cliente'}>
      <Icon {...props} />
    </Tooltip>;
}
