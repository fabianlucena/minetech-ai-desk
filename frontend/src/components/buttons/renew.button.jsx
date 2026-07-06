import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/RefreshTwoTone';

export default function RenewButton(props) {
  return <IconButton
    {...{title: 'Renovar', ...props}}
  >
    <RefreshIcon />
  </IconButton>;
}
