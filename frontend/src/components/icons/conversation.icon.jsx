import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/QuestionAnswerTwoTone';

export default function ConversationIcon(props) {
  return <Tooltip title={props.title || 'Conversación'}>
      <Icon {...props} />
    </Tooltip>;
}
