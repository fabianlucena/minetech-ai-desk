import { Container, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return <Container sx={{ py: 4 }}>
    <Paper elevation={0} sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>Página no encontrada o prohibida</Typography>
      Por favor, verifique la URL o regrese a la página de inicio.

      <br />
      <Button variant="contained" size="large" onClick={() => navigate('/')}>
        Ir a inicio
      </Button>
    </Paper>
  </Container>;
}