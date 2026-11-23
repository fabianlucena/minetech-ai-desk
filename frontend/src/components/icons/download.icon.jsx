import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DownloadTwoTone';

export default function DocumentIcon(props) {
  return <Tooltip title={props.title || 'Descargar'}>
      <Icon {...props} />
    </Tooltip>;
}
