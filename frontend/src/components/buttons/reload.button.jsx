import RefreshIcon from '@mui/icons-material/RefreshTwoTone';

export default function ReloadButton(props) {
  return <button {...{title: 'Recargar', ...props}}>
    <RefreshIcon />
  </button>;
}
