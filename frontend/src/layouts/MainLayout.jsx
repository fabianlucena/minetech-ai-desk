import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';

export default function MainLayout() {
  return <>
    <Header />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        overflow: 'auto',
      }}
    >
      <Menu />

      <Box
        sx={{
          padding: 1,
          overflow: 'auto',
          flex: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>

    <Footer >
      © 2026 MineTech. Todos los derechos reservados.
    </Footer> 
  </>;
}
