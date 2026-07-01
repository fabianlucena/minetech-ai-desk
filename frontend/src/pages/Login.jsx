import { useState } from 'react';
import Form from '../components/Form';
import TextField from '../components/TextField';
import PasswordField from '../components/PasswordField';
import { loginService } from '../services/login.service.js';

export default function Login() {
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  async function onSubmit() {
    const response = await loginService(data);
    console.log(response);
  }

  return <Form
    title="Ingresar"
    description="Por favor, ingrese sus credenciales para continuar"
    onSubmit={onSubmit}
    sx={{
      maxWidth: 400,
      margin: "auto",
    }}
  >
    <TextField label="Nombre de usuario" value={data.username} onChange={(e) => setData({...data, username: e.target.value})} />
    <PasswordField label="Contraseña" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
  </Form>;
}