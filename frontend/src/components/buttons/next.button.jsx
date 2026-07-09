import IconButton from '@mui/material/IconButton';
import MUIIcon from '@mui/icons-material/ArrowForwardIos';

export default function NextButton(props) {
  return <IconButton
    {...{title: 'Siguiente', ...props}}
  >
    <MUIIcon />
  </IconButton>;
}
