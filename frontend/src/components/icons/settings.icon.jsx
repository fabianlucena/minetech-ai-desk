import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/SettingsTwoTone';

export default function SettingsIcon(props) {
  return <Tooltip title={props.title || 'Configuración'}>
      <Icon {...props} />
    </Tooltip>;
}
