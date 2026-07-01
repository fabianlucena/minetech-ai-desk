import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

export default function Header({ toggleOpen }) {
  return <AppBar>
    <Toolbar>
      <IconButton color="inherit" onClick={toggleOpen}>
        <MenuIcon />
      </IconButton>

      <img class="header-logo" src="/minetech-logo.png" alt="Logo" />

      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        MineTech AI Desk
      </Typography>

      <IconButton color="inherit">
        <AccountCircle />
      </IconButton>
    </Toolbar>
  </AppBar>;
}