import IconButton from './IconButton';
import Icon from '@mui/icons-material/AddTwoTone';

export default function CreateButton(props) {
  return <IconButton
    title='Crear'
    Icon={Icon}
    {...props}
  />;
}