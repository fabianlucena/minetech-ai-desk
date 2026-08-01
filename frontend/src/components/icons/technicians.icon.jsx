import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/EngineeringTwoTone';

export default function TechniciansIcon(props) {
  return <Tooltip title={props.title || 'Técnicos'}>
      <Icon {...props} />
    </Tooltip>;
}
