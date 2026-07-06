import { Select, MenuItem, Checkbox } from '@mui/material';

export default function CheckboxSelectField({
  label,
  value,
  onChange,
  options = [],
  renderValue,
  multiple = false,
}) {
  const defaultRenderValue = multiple
    ? (selected) => options.filter((option) => selected.includes(option.value)).map((option) => option.label).join(', ')
    : (selected) => options.find((option) => option.value === selected)?.label ?? selected;

  return <Select
    label={label}
    multiple={multiple}
    value={value}
    onChange={onChange}
    renderValue={renderValue || defaultRenderValue}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value} title={option.title}>
        <Checkbox checked={value?.includes?.(option.value)} />
        {option.label}
      </MenuItem>
    ))}
  </Select>;
}