import IconButton from './IconButton';
import Icon from '@mui/icons-material/UploadTwoTone';

export default function UploadButton(props) {
  return <IconButton
    title='Cargar'
    Icon={Icon}
    {...props}
  />;
}