import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/arrowBackTwoTone';

export default function ArrowBackIcon(props) {
  return <Tooltip title={props.title || 'Flecha atrás'}>
      <Icon {...props} />
    </Tooltip>;
}
