import { Typography } from '@mui/material';

export default function Footer() {
  return <footer
    style={{
      fontSize: '12px',
      fontFamily: '"Inter", Sans-serif',
      textAlign: 'center',
      color: '#d1d1d1',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '.4em .8em',
    }}
  >
    <Typography
      variant="body3"
      color="black"
    >
      <a href="https://www.minetech.com.ar" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Copyright © 2026 MineTech. Todos los derechos reservados.</a>
    </Typography>
    <Typography
      variant="body3"
      color="text.secondary"
    >
      <a href="mailto:info@fabianlucena.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Desarrollado por Ing. Fabian Lucena</a>
    </Typography>
  </footer>;
}