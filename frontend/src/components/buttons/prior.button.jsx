import IconButton from './IconButton';
import Icon from '@mui/icons-material/ArrowBackIos';

export default function PriorButton(props) {
  return <IconButton
    title='Anterior'
    Icon={Icon}
    {...props}
  />;
}