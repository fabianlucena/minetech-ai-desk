import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useGlobal } from '../state/global';

export default function Menu() {
  const { menuOpen } = useGlobal();

  return <Box
    sx={{
      display: menuOpen ? 'block' : 'none',
    }}
  >
    <List>
      <ListItem >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemText primary="Inicio" />
        </Link>
      </ListItem>
      <ListItem >
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemText primary="Acerca de" />
        </Link>
      </ListItem>
      <ListItem >
        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemText primary="Login" />
        </Link>
      </ListItem>
      <ListItem >
        <Link to="/otro" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemText primary="Otro" />
        </Link>
      </ListItem>
    </List>
  </Box>;
}