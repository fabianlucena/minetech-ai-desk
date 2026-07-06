import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/VisibilityTwoTone';

export default function ShowButton(props) {
  return <IconButton
    {...{title: 'Mostrar', ...props}}
  >
    <VisibilityIcon />
  </IconButton>;
}
