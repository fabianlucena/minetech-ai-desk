import IconButton from './IconButton';
import Icon from '@mui/icons-material/ArrowForwardIos';

export default function NextButton(props) {
  return <IconButton
    title='Siguiente'
    Icon={Icon}
    {...props}
  />;
}