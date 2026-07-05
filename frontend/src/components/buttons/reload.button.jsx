import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/RefreshTwoTone';

export default function ReloadButton(props) {
  return <IconButton
    {...{title: 'Recargar', ...props}}
  >
    <RefreshIcon />
  </IconButton>;
}
