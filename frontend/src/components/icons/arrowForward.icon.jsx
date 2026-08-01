import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/arrowForwardTwoTone';

export default function ArrowForwardIcon(props) {
  return <Tooltip title={props.title || 'Fleha adelante'}>
      <Icon {...props} />
    </Tooltip>;
}
