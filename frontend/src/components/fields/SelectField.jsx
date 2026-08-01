import { MenuItem } from '@mui/material';
import TextField from './TextField';

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  multiple = false,
  ...props
}) {
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