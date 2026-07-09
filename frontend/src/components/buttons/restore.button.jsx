import IconButton from './IconButton';
import Icon from '@mui/icons-material/RestoreFromTrashTwoTone';

export default function RestoreButton(props) {
  return <IconButton
    title='Restaurar'
    Icon={Icon}
    {...props}
  />;
}