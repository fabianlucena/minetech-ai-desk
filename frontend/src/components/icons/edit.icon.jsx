import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/EditTwoTone';

export default function EditIcon(props) {
  return <Tooltip title={props.title || 'Editar'}>
      <Icon {...props} />
    </Tooltip>;
}
