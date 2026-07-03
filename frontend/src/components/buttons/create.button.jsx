import AddIcon from '@mui/icons-material/Add';

export default function CreateButton(props) {
  return <button {...{title: 'Crear', ...props}}>
    <AddIcon />
  </button>;
}
