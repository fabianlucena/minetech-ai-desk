import { Select, MenuItem, Checkbox } from '@mui/material';

export default function CheckboxSelectField({
  value,
  onChange,
  options = [],
}) {
  return <Select
    multiple
    value={value}
    onChange={onChange}
    renderValue={(selected) => options.filter((option) => selected.includes(option.value)).map((option) => option.label).join(', ')}
  >
    {options.map((option) => (
      <MenuItem value={option.value}>
        <Checkbox checked={value?.includes?.(option.value)} />
        {option.label}
      </MenuItem>
    ))}
  </Select>;
}