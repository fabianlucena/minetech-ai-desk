import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import useGlobal from '../contexts/useGlobal';
import useUser from '../contexts/useUser';
import { LoginIcon } from '../components/icons/index.jsx';
import { useNavigate } from 'react-router-dom';

const version = import.meta.env.PACKAGE_VERSION;

export default function Header({
  hideMenuButton = false,
  hideUserMenu = false,
}) {
  const { toggleMenuOpen } = useGlobal();
  const user = useUser();
  const navigate = useNavigate();

  return <AppBar >
    <Toolbar
      style={{
        margin: 0,
        padding: '0 .5em',
      }}
    >
      {!hideMenuButton && <IconButton
        color="inherit"
        onClick={toggleMenuOpen}
      >
        <MenuIcon />
      </IconButton>}

      <img
        src="/minetech.png"
        alt="Logo"
        style={{
          height: '2em',
          margin: '0 .5em',
        }}
      />

      <Typography
        variant="h4"
        sx={{
          flexGrow: 1,
          fontFamily: '"Inter", Sans-serif',
          fontWeight: 'bold',
        }}
      >
        AI Desk

        {version && <Typography
          variant="h6"
          sx={{
            display: 'inline-block',
            fontSize: '0.4em',
            flexGrow: 1,
            fontFamily: '"Inter", Sans-serif',
            fontWeight: 'bold',
            marginLeft: '0.5em',
          }}
        >
          v{version}
        </Typography>}
      </Typography>

      {!hideUserMenu && <>
        {user ? <>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {user.displayName}
          </Typography>
          <AccountCircle />
        </> :
        <IconButton color="inherit" onClick={() => navigate("/login")}>
          <LoginIcon />
        </IconButton>}
      </>}
    </Toolbar>
  </AppBar>;
}