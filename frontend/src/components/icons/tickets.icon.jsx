import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/LabelTwoTone';

export default function TicketsIcon(props) {
  return <Tooltip title={props.title || 'Tickets'}>
      <Icon {...props} />
    </Tooltip>;
}
