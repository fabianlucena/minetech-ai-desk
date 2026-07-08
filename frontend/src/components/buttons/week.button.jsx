import IconButton from '@mui/material/IconButton';
import MUIIcon from '@mui/icons-material/ViewWeekTwoTone';

export default function WeekButton(props) {
  return <IconButton
    {...{title: 'Semana', ...props}}
  >
    <MUIIcon />
  </IconButton>;
}
