import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/Wifi';
  
export default function ConnectedIcon(props) {
  props = {
    ...props,
    sx: {
      color: '#008800',
    },
  };

  return <Tooltip title={props.title || 'Conectado'}>
      <Icon {...props} />
    </Tooltip>;
}
