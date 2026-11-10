import { Container, Paper, Typography, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get('message') || 'Error desconocido';

  return <Container sx={{ py: 4 }}>
    <Paper elevation={0} sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>Error</Typography>
      {message}
      
      <br />
      <Button variant="contained" size="large" onClick={() => navigate('/')}>
        Ir a inicio
      </Button>
    </Paper>
  </Container>
}