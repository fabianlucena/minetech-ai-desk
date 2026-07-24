import IconButton from './IconButton';
import Icon from '@mui/icons-material/DeleteTwoTone';

export default function DeleteButton(props) {
  return <IconButton
    title='Eliminar'
    Icon={Icon}
    {...props}
  />;
}