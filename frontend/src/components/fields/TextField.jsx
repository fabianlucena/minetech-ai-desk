import { TextField as MuiTextField, Box } from '@mui/material';

export default function TextField({
  tools,
  children,
  variant = 'outlined',
  sx = {},
  readOnly,
  value,
  ...props
}) {
  if (variant === 'standard') {
    sx = {...sx};
    sx['& .MuiInput-underline:before'] = {
      borderBottom: 'none',
      ...sx['& .MuiInput-underline:before'],
    };
    sx['& .MuiInput-underline:after'] = {
      borderBottom: 'none',
      ...sx['& .MuiInput-underline:after'],
    };
  }

  if (readOnly) {
    props ??= {};
    props.slotProps ??= {};
    props.slotProps.input ??= {};
    // oxlint-disable-next-line react/immutability
    props.slotProps.input.readOnly = true;
  }

  if (value) {
    props ??= {};
    props.slotProps ??= {};
    props.slotProps.inputLabel ??= {};
    props.slotProps.inputLabel.shrink ??= {};
  }

  return <Box 
    sx={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <MuiTextField
      fullWidth
      variant={variant}
      sx={sx}
      value={value}
      {...props}
    >
      {children}
    </MuiTextField>
    {tools && <Box
      sx={{
        right: 4,
        position: 'absolute',
        textAlign: 'right',
      }}
    >
      {tools}
    </Box>}
  </Box >
}