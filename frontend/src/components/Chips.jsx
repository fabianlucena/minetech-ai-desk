import { useState } from 'react';
import { Box, Chip } from '@mui/material';

export default function Chips({
  chips,
  mapper,
}) {
  const defaultMapper = chip => ({ id: chip.id || chip.uuid || chip.value || chip.label, label: chip.label });

  return <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {chips
      .map(mapper || defaultMapper)
      .map(chip =>
        <Chip key={chip.id} label={chip.label} />
      )}
  </Box>;
}