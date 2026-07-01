import { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Menu from './Menu';

import MenuIcon from '@mui/icons-material/Menu';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return <>
    <Header toggleOpen={toggleOpen} />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
      }}
    >
      <Menu open={open} />

      <Box sx={{ marginTop: 8, padding: 3 }}>
        {children}
      </Box>
    </Box>
  </>;
}
