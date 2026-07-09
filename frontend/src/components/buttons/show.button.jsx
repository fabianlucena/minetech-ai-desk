import IconButton from './IconButton';
import Icon from '@mui/icons-material/VisibilityTwoTone';

export default function ShowButton(props) {
  return <IconButton
    title='Mostrar'
    Icon={Icon}
    {...props}
  />;
}