import IconButton from './IconButton';
import Icon from '@mui/icons-material/EditTwoTone';

export default function EditButton(props) {
  return <IconButton
    title='Modificar'
    Icon={Icon}
    {...props}
  />;
}