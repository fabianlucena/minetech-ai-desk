import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGlobal } from '../state/global';
import { useRoutes } from '../routes.jsx';

function flattenNavigableRoutes(routes) {
  const result = [];

  function walk(node) {
    const isNavigable = node.index || node.path && node.path !== '*';

    if (isNavigable) {
      result.push({
        path: node.path,
        label: node.label ?? null,
        menuItemOrder: node.menuItemOrder ?? Infinity,
      });
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(child => walk(child));
    }
  }

  routes.forEach(r => walk(r));
  return result;
}

export default function Menu() {
  const { menuOpen } = useGlobal();
  const routes = useRoutes();
  const [ menuItems, setMenuItems ] = useState([]);

  useEffect(() => {
    const menuItems = flattenNavigableRoutes(routes)
      .filter(route => route.label)
      .sort((a, b) => a.menuItemOrder - b.menuItemOrder);

    setMenuItems(menuItems);
  }, [routes]);

  return <Box
    sx={{
      display: menuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      bgcolor: '#666666'
    }}
  >
    <List
      sx={{
        margin: 0,
        padding: 0,
        flex: 1,
      }}
    >
      {menuItems.map((route, index) => (
        <ListItem key={index}>
          <Link to={route.path || (route.index ? '/' : '')} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary={route.label || route.path || (route.index ? '/' : '')} />
          </Link>
        </ListItem>
      ))}
    </List>
  </Box>;
}