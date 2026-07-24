import { Box, MenuItem, Checkbox } from '@mui/material';
import TextField from './TextField';

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  renderValue,
  multiple = false,
  ...props
}) {
  const defaultRenderValue = multiple
    ? (selected) => options.filter((option) => selected.includes(option.value)).map((option) => option.label).join(', ')
    : (selected) => options.find((option) => option.value === selected)?.label ?? selected;

  return <TextField
    select
    label={label}
    multiple={multiple}
    value={value}
    onChange={onChange}
    {...props}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value} title={option.title}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>;
}