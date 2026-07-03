import RefreshIcon from '@mui/icons-material/Refresh';

export default function ReloadButton(props) {
  return <button {...{title: 'Recargar', ...props}}>
    <RefreshIcon />
  </button>;
}
