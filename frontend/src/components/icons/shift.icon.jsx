import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CalendarMonthTwoTone';

export default function ShiftIcon(props) {
  return <Tooltip title={props.title || 'Turno'}>
      <Icon {...props} />
    </Tooltip>;
}
