import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DashboardTwoTone';

export default function DashboardIcon(props) {
  return <Tooltip title={props.title || 'Dashboard'}>
      <Icon {...props} />
    </Tooltip>;
}
