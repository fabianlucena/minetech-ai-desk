import { Typography } from '@mui/material';

export default function Footer() {
  return <footer
    style={{
      fontSize: '12px',
      fontFamily: '"Inter", Sans-serif',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      color: '#d1d1d1',
      backgroundColor: 'rgba(32, 32, 32, .8)',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '.2em .5em',
    }}
  >
    <Typography
      variant="body3"
      color="black"
    >
      Copyright © 2026 MineTech. Todos los derechos reservados.
    </Typography>
    <Typography
      variant="body3"
      color="text.secondary"
    >
      Desarrollado por Ing. Fabian Lucena
    </Typography>
  </footer>;
}