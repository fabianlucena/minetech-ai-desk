import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/HomeTwoTone';

export default function HomeIcon(props) {
  return <Tooltip title={props.title || 'Inicio'}>
      <Icon {...props} />
    </Tooltip>;
}
