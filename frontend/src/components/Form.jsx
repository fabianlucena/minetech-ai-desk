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
  disabled,
  disabledMessage = 'Procesando...',
  sx,
}) {
  return <Paper
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
    {disabled && <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(112, 112, 112, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {disabledMessage}
      </Typography>
    </Box>}
    
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
  </Paper>;
}