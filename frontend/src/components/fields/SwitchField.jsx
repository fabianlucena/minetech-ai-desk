import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function SwitchField({
  onChange,
  checked,
  label,
  readOnly,
}) {
  return <FormControlLabel
      control={
        <Switch
          checked={checked}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e)}
        />
    }
    label={label}
  />;
}