import { Button, Box } from '@mui/material';

export default function ButtonsDemo() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button variant="contained" color="primary">
        Primario MineTech
      </Button>

      <Button variant="contained" color="secondary">
        Secundario MineTech
      </Button>
    </Box>
  );
}
