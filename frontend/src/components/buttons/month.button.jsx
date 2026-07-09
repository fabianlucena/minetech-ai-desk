import IconButton from '@mui/material/IconButton';
import MUIIcon from '@mui/icons-material/CalendarMonthTwoTone';

export default function MonthButton(props) {
  return <IconButton
    {...{title: 'Mes', ...props}}
  >
    <MUIIcon />
  </IconButton>;
}
