import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DeleteTwoTone';

export default function DeleteIcon(props) {
  return <Tooltip title={props.title || 'Eliminar'}>
      <Icon {...props} />
    </Tooltip>;
}
