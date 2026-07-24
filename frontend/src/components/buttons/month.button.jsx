import IconButton from './IconButton';
import Icon from '@mui/icons-material/CalendarMonthTwoTone';

export default function MonthButton(props) {
  return <IconButton
    title='Mes'
    Icon={Icon}
    {...props}
  />;
}