import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/RestoreFromTrashTwoTone';

export default function RestoreIcon(props) {
  return <Tooltip title={props.title || 'Restaurar'}>
      <Icon {...props} />
    </Tooltip>;
}
