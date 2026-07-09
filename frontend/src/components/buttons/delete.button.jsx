import IconButton from '@mui/material/IconButton';
import Icon from '@mui/icons-material/DeleteTwoTone';

export default function DeleteButton({ size, sx, ...props }) {
  const iconSx = {};
  if (size === 'small') {
    iconSx.fontSize = 16;
    sx = {
      padding: '4px',
      minWidth: 0,
      width: 16,
      height: 16,
      margin: 0,
      padding: 0,
      ...sx,
    };
  }

  return <IconButton
    {...{ title: 'Eliminar', sx: sx, ...props}}
  >
    <Icon sx={iconSx} />
  </IconButton>;
}
