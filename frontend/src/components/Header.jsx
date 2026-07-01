import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';

export default function Header() {
  return <AppBar position="static">
    <Toolbar>
      <IconButton color="inherit">
        <MenuIcon />
      </IconButton>

      <img class="header-logo" src="/minetech.png" alt="Logo" />

      <Typography variant="h6" component="div">
        AI Desk
      </Typography>

      <IconButton color="inherit">
        <AccountCircle />
      </IconButton>
    </Toolbar>
  </AppBar>;
}