import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/WifiOff';
  
export default function DisconnectedIcon(props) {
  props = {
    ...props,
    sx: {
      color: '#D00000',
    },
  };
  
  return <Tooltip title={props.title || 'Desconectado'}>
      <Icon {...props} />
    </Tooltip>;
}
