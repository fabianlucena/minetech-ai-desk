import { Box, Paper, Typography, Button, Stack } from '@mui/material';

export default function Form({
  title,
  description,
  footer,
  children,
  onSubmit,
  submitText = 'Enviar',
  onCancel,
  cancelText = 'Cancelar',
  sx,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 480,
        ...sx
      }}
    >
      {(title || description) && <Box>
        {title && <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>}
        {description && <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>}
      </Box>}

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
        <Stack spacing={2}>
          {children}
        </Stack>

        {(footer || onSubmit || submitText || onCancel || cancelText) && <Box
            sx={{
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          {footer}
          {(onCancel || cancelText) && <Button variant="outlined" onClick={onCancel}>
            {cancelText || "Cancelar"}
          </Button>}
          {(onSubmit || submitText) && <Button variant="contained" type="submit" >
            {submitText || "Enviar"}
          </Button>}
        </Box> }
      </form>
    </Paper>
  );
}