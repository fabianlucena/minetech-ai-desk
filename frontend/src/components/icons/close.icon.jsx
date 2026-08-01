import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CloseTwoTone';

export default function CloseIcon(props) {
  return <Tooltip title={props.title || 'Cerrar'}>
      <Icon {...props} />
    </Tooltip>;
}
