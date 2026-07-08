import IconButton from '@mui/material/IconButton';
import MUIIcon from '@mui/icons-material/ArrowBackIos';

export default function PriorButton(props) {
  return <IconButton
    {...{title: 'Anterior', ...props}}
  >
    <MUIIcon />
  </IconButton>;
}
