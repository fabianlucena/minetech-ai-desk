import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/QuestionAnswerTwoTone';

export default function conversationsMessageIcon(props) {
  return <Tooltip title={props.title || 'Mensajes'}>
      <Icon {...props} />
    </Tooltip>;
}
