import { useState } from 'react';
import Form from '../components/Form.jsx';
import TextField from '../components/TextField.jsx';
import { loginService } from '../services/login.service.js';

export default function LoginScreen() {
  const [data, setData] = useState({});

  return <Form
    title="Iniciar Sesión"
    onSubmit={async () => {
      try {
        const res = await loginService(data, { debug: true });
        console.log('Login successful:', res);
      }
      catch (error) {
        console.error('Login failed:', error);
      }
    }}
  >
    <TextField
      label="Nombre de usuario"
      value={data.username}
      onChangeText={(value) => setData({ ...data, username: value })}
      placeholder="Escriba aquí su nombre de usuario"
    />
    <TextField
      label="Contraseña"
      value={data.password}
      onChangeText={(value) => setData({ ...data, password: value })}
      placeholder="Escriba aquí su contraseña"
      secureTextEntry
    />
  </Form>;
}
