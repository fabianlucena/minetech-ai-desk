import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';

import MenuIcon from '@mui/icons-material/Menu';

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(true);

  const toggleShowMenu = () => setShowMenu(!showMenu);

  return <>
    <Header toggleShowMenu={toggleShowMenu} />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        overflow: 'auto',
      }}
    >
      <Menu showMenu={showMenu} />

      <Box
        sx={{
          padding: 1,
          overflow: 'auto',
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>

    <Footer >
      © 2026 MineTech. Todos los derechos reservados.
    </Footer> 
  </>;
}
