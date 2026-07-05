import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddTwoTone';

export default function CreateButton(props) {
  return <IconButton
    {...{title: 'Crear', ...props}}
  >
    <AddIcon />
  </IconButton>;
}
