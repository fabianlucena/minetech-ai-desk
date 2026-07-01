import './App.css';
import Layout from './components/Layout';
import { Typography, Box } from '@mui/material';
import ButtonsDemo from './components/ButtonsDemo';
import MineTechGrid from './components/MineTechGrid';

export default function App() {
  return <Layout>
    <Typography variant="h4" sx={{ mb: 3 }}>
      Panel Administrativo MineTech
    </Typography>

    <ButtonsDemo />

    <Box sx={{ mt: 4 }}>
      <MineTechGrid />
    </Box>
  </Layout>;
}