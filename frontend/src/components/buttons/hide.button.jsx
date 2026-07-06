import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffTwoTone';

export default function HideButton(props) {
  return <IconButton 
    {...{title: 'Ocultar', ...props}}
  >
    <VisibilityOffIcon />
  </IconButton>;
}
