import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/CheckTwoTone';
import { grey } from '@mui/material/colors';

export default function MessageSentIcon({
  title,
  ...props
}) {
  props ??= {};
  props.sx ??= {};
  props.sx.color = grey[800];

  return <Tooltip title={title || 'Enviado'}>
      <Icon {...props} />
    </Tooltip>;
}