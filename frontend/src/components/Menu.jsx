import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function Menu({ showMenu }) {
  return <Box
    sx={{
      display: showMenu ? 'block' : 'none',
    }}
  >
    <List>
      <ListItem >
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem >
        <ListItemText primary="Tickets" />
      </ListItem>
      <ListItem >
        <ListItemText primary="Clientes" />
      </ListItem>
      <ListItem >
        <ListItemText primary="Operadores" />
      </ListItem>
    </List>
  </Box>;
}