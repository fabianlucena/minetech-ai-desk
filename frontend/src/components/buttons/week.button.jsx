import IconButton from './IconButton';
import Icon from '@mui/icons-material/ViewWeekTwoTone';

export default function WeekButton(props) {
  return <IconButton
    title='Semana'
    Icon={Icon}
    {...props}
  />;
}