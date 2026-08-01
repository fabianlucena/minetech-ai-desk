import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/NoAccountsTwoTone';

export default function BanIcon(props) {
  return <Tooltip title={props.title || 'Banear'}>
      <Icon {...props} />
    </Tooltip>;
}
