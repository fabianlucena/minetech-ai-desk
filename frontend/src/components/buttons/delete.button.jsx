import DeleteIcon from '@mui/icons-material/DeleteTwoTone';

export default function DeleteButton(props) {
  return <button {...{title: 'Eliminar', ...props}}>
    <DeleteIcon />
  </button>;
}
