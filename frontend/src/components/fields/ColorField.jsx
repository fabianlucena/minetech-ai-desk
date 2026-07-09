import TextField from './TextField';

export default function ColorField({
  label,
  value,
  onChange,
  ...props
}) {
  return <TextField
    type="color"
    label={label}
    value={value}
    onChange={onChange}
    {...props}
  />;
}