import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/HourglassFullTwoTone';
import { grey } from '@mui/material/colors';
  
export default function MessageWaitingIcon({
  title,
  ...props
}) {
  props ??= {};
  props.sx ??= {};
  props.sx.color = grey[800];

  return <Tooltip title={title || 'Esperando'}>
      <Icon {...props} />
    </Tooltip>;
}