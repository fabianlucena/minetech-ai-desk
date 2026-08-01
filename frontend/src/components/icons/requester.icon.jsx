import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/ContactSupportTwoTone';
//import Icon from '@mui/icons-material/RecordVoiceOverTwoTone';

export default function RequesterIcon(props) {
  return <Tooltip title={props.title || 'Solicitante'}>
      <Icon {...props} />
    </Tooltip>;
}
