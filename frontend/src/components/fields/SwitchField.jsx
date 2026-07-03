import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function SwitchField(props) {
  return <FormControlLabel
      control={
        <Switch
          checked={props.checked}
          onChange={(e) => props.onChange(e)}
        />
    }
    label={props.label}
  />;
}