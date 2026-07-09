import IconButton from './IconButton';
import Icon from '@mui/icons-material/RefreshTwoTone';

export default function RenewButton(props) {
  return <IconButton
    title='Renovar'
    Icon={Icon}
    {...props}
  />;
}