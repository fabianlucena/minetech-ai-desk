import IconButton from './IconButton';
import Icon from '@mui/icons-material/RefreshTwoTone';

export default function ReloadButton(props) {
  return <IconButton
    title='Recargar'
    Icon={Icon}
    {...props}
  />;
}