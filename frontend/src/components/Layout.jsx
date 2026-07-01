import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';

import MenuIcon from '@mui/icons-material/Menu';

export default function Layout() {
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
