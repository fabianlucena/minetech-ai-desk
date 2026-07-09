import IconButton from './IconButton';
import Icon from '@mui/icons-material/VisibilityOffTwoTone';

export default function HideButton(props) {
  return <IconButton
    title='Ocultar'
    Icon={Icon}
    {...props}
  />;
}