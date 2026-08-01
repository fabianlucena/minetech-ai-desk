import { Tooltip } from '@mui/material';
import Icon from '@mui/icons-material/InfoTwoTone';

export default function AboutIcon(props) {
  return <Tooltip title={props.title || 'Acerca de'}>
      <Icon {...props} />
    </Tooltip>;
}
