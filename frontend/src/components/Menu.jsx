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
      padding: 2,
      display: showMenu ? 'block' : 'none',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      Menú
    </Typography>

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