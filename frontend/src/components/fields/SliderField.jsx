import { Box, Slider, Typography } from '@mui/material';

export default function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1
}) {
  return <Box>
    <Typography variant="subtitle1">{label}</Typography>
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
    />
  </Box>;
}
