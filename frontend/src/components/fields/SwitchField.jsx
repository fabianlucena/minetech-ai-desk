import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function SwitchField({ onChange, checked, label }) {
  return <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => onChange?.(e)}
        />
    }
    label={label}
  />;
}