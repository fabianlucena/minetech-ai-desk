import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/ArrowForwardTwoTone';

export default function ArrowForwardIcon(props) {
  return <Tooltip title={props.title || 'Flecha adelante'}>
      <Icon {...props} />
    </Tooltip>;
}
