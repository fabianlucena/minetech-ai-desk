import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CheckTwoTone';
import { grey } from '@mui/material/colors';

export default function MessageSentIcon({
  title,
  ...props
}) {
  props = {
    ...props,
    sx: {
      color: grey[400],
      ...props?.sx,
    }
  };

  return <Tooltip title={title || 'Enviado'}>
      <Icon {...props} />
    </Tooltip>;
}