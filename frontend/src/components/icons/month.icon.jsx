import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CalendarMonthTwoTone';

export default function MonthIcon(props) {
  return <Tooltip title={props.title || 'Mes'}>
      <Icon {...props} />
    </Tooltip>;
}
