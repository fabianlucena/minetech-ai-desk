import TextField from './TextField';

export default function PasswordField(props) {
  return <TextField {...{type: 'password', ...props}}/>
}