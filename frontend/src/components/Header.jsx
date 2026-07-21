import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { useGlobal } from '../states/global';

export default function Header() {
  const { toggleMenuOpen } = useGlobal();

  return <AppBar >
    <Toolbar
      style={{
        margin: 0,
        padding: '0 .5em',
      }}
    >
      <IconButton
        color="inherit"
        onClick={toggleMenuOpen}
      >
        <MenuIcon />
      </IconButton>

      <img
        src="/minetech.png"
        alt="Logo"
        style={{
          height: '2em',
          margin: '0 .5em',
        }}
      />

      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          fontFamily: '"Inter", Sans-serif',
          fontWeight: 'bold',
        }}
      >
        AI Desk
      </Typography>

      <IconButton color="inherit">
        <AccountCircle />
      </IconButton>
    </Toolbar>
  </AppBar>;
}