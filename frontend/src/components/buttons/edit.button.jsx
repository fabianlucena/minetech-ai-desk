import EditIcon from '@mui/icons-material/EditTwoTone';

export default function EditButton(props) {
  return <button {...{title: 'Modificar', ...props}}>
    <EditIcon />
  </button>;
}
