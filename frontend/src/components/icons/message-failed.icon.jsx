import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/ErrorTwoTone';
import { red } from '@mui/material/colors';

export default function MessageFailedIcon({
  title,
  ...props
}) {
  props ??= {};
  props.sx ??= {};
  props.sx.color = red[600];

  return <Tooltip title={title || 'Fallido'}>
      <Icon {...props} />
    </Tooltip>;
}