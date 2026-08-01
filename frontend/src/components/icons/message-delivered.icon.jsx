import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/DoneAllTwoTone';
import { grey } from '@mui/material/colors';

export default function MessageDeliveredIcon({
  title,
  ...props
}) {
  props = {
    ...props,
    sx: {
      color: grey[800],
      ...props?.sx,
    }
  };

  return <Tooltip title={title || 'Entregado'}>
      <Icon {...props} />
    </Tooltip>;
}
