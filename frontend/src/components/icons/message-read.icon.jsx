import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DoneAllTwoTone';
import { blue } from '@mui/material/colors';

export default function MessageReadIcon({
  title,
  ...props
}) {
  props = {
    ...props,
    sx: {
      color: blue[600],
      ...props?.sx,
    }
  };

  return <Tooltip title={title || 'Leído'}>
      <Icon {...props} />
    </Tooltip>;
}