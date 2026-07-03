import { Box, Paper, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Form({
  title,
  description,
  footer,
  children,
  onSubmit,
  submitText = 'Enviar',
  onCancel,
  cancelText = 'Cancelar',
  onCancelGoBack,
  disabled,
  disabledMessage = 'Procesando...',
  sx,
}) {
  const navigate = useNavigate();

  return <Paper
    elevation={0}
    sx={{
      p: 3,
      display: "flex",
      flexDirection: "column",
      gap: 3,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      ...sx,
    }}
  >
    {disabled && <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(63, 63, 63, 0.8)",
        display: "flex",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        flexDirection: "column",
      }}
    >
      <CircularProgress
        size={32}
        color="primary"
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
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

      {(footer || onSubmit || submitText || onCancel || onCancelGoBack) && <Box
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
        {(onCancel) && <Button variant="outlined" onClick={onCancel}>
          {cancelText || "Cancelar"}
        </Button>}
        {(onCancelGoBack) && <Button variant="outlined" onClick={() => navigate(-1)}>
          {cancelText || "Cancelar"}
        </Button>}
        {(onSubmit || submitText) && <Button variant="contained" type="submit" >
          {submitText || "Enviar"}
        </Button>}
      </Box> }
    </form>
  </Paper>;
}