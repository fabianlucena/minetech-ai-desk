import AddIcon from '@mui/icons-material/AddTwoTone';

export default function CreateButton(props) {
  return <button {...{title: 'Crear', ...props}}>
    <AddIcon />
  </button>;
}
