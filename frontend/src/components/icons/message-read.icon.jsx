import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DoneAllTwoTone';
import { blue } from '@mui/material/colors';
  
export default function MessageReadIcon({
  title,
  ...props
}) {
  props ??= {};
  props.sx ??= {};
  props.sx.color = blue[600];

  return <Tooltip title={title || 'Leído'}>
      <Icon {...props} />
    </Tooltip>;
}