import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditTwoTone';

export default function EditButton(props) {
  return <IconButton
    {...{title: 'Modificar', ...props}}
  >
    <EditIcon />
  </IconButton>;
}
