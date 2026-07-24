import MUIIconButton from '@mui/material/IconButton';

export default function IconButton({
  size,
  sx,
  selected,
  Icon,
  title,
  ...props
}) {
  let iconSx = {};
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

  if (selected) {
    sx ??= {};
    sx.backgroundColor ??= 'primary.main';
  }

  return <MUIIconButton
    {...{title, sx, ...props}}
  >
    <Icon sx={iconSx} />
  </MUIIconButton>;
}
