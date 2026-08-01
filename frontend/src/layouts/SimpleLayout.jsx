import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SimpleLayout({
  children,
}) {
  return <>
    <Header
      hideMenuButton={true}
      hideUserMenu={true}
    />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        overflow: 'auto',
      }}
    >

      <Box
        sx={{
          padding: 1,
          overflow: 'auto',
          flex: 1,
          display: 'flex',
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>

    <Footer >
      © 2026 MineTech. Todos los derechos reservados.
    </Footer> 
  </>;
}
