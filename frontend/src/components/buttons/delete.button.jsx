import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton(props) {
  return <button {...{title: 'Eliminar', ...props}}>
    <DeleteIcon />
  </button>;
}
