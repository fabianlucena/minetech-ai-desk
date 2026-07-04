import { Select, MenuItem, Checkbox } from '@mui/material';

export default function CheckboxSelectField({
  value,
  onChange,
  options = [],
  renderValue,
}) {
  const defaultRenderValue = (selected) => options.filter((option) => selected.includes(option.value)).map((option) => option.label).join(', ');

  return <Select
    multiple
    value={value}
    onChange={onChange}
    renderValue={renderValue || defaultRenderValue}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={value?.includes?.(option.value)} />
        {option.label}
      </MenuItem>
    ))}
  </Select>;
}