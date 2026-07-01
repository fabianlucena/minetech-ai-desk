import { useState } from 'react';
import Form from '../components/Form';
import TextField from '../components/TextField';
import PasswordField from '../components/PasswordField';

export default function Login() {
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  return <Form
    title="Ingresar"
    description="Por favor, ingrese sus credenciales para continuar"
    onSubmit={() => console.log(data)}
    sx={{
      maxWidth: 400,
      margin: "auto",
    }}
  >
    <TextField label="Nombre de usuario" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} />
    <PasswordField label="Contraseña" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
  </Form>;
}