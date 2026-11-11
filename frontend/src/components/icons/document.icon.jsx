import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DescriptionTwoTone';

export default function DocumentIcon(props) {
  return <Tooltip title={props.title || 'Documento'}>
      <Icon {...props} />
    </Tooltip>;
}
