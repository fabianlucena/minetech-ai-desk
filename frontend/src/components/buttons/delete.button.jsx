import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';

export default function DeleteButton(props) {
  return <IconButton
    {...{title: 'Eliminar', ...props}}
  >
    <DeleteIcon />
  </IconButton>;
}
