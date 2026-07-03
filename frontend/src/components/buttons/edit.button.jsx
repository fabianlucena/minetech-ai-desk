import EditIcon from '@mui/icons-material/Edit';

export default function EditButton(props) {
  return <button {...{title: 'Modificar', ...props}}>
    <EditIcon />
  </button>;
}
