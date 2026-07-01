import { useState } from 'react';
import { Box, Snackbar } from '@mui/material';
import Header from './Header';
import Menu from './Menu';

import MenuIcon from '@mui/icons-material/Menu';

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(true);
  const [open, setOpen] = useState(true);

  const toggleShowMenu = () => setShowMenu(!showMenu);

  return <>
    <Header toggleShowMenu={toggleShowMenu} />

    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      message="Operación realizada correctamente"
    />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
      }}
    >
      <Menu showMenu={showMenu} />

      <Box
        sx={{
          marginTop: 8,
          padding: 3,
          overflow: 'auto',
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  </>;
}
