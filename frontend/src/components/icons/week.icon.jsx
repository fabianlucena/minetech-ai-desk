import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/ViewWeekTwoTone';
  
export default function WeekIcon(props) {
  return <Tooltip title={props.title || 'Semana'}>
      <Icon {...props} />
    </Tooltip>;
}
