import { useState } from 'react';
import { Box, Chip as MUIChip } from '@mui/material';
import { getDarkerColor } from '../utils/color.js';

export default function Chip({
  label,
  title,
  color,
  sx,
  ...props
}) {
  return <MUIChip
    label={label}
    title={title}
    color={color}
    sx={{
      backgroundColor: color,
      borderColor: getDarkerColor(color, .5),
      borderWidth: 2,
      ...sx,
    }}
    {...props}
  />;
}