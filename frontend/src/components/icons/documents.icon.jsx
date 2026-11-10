import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/FolderTwoTone';

export default function DocumentsIcon(props) {
  return <Tooltip title={props.title || 'Documentos'}>
      <Icon {...props} />
    </Tooltip>;
}
