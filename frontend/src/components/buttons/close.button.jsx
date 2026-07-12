import IconButton from './IconButton';
import Icon from '@mui/icons-material/CloseTwoTone';

export default function CloseButton(props) {
  return <IconButton
    title='Cerrar'
    Icon={Icon}
    {...props}
  />;
}