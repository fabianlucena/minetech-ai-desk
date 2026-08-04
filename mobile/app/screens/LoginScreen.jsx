import { useState, useCallback } from 'react';
import Screen from '../components/Screen.jsx';
import Form from '../components/Form.jsx';
import TextField from '../components/TextField.jsx';
import { loginService } from '../services/login.service.js';

export default function LoginScreen() {
  const [data, setData] = useState({});

  const submitHandler = useCallback(async () => {
    try {
      const res = await loginService(data, { debug: true });
      console.log('Login successful:', res);
    }
    catch (error) {
      console.error('Login failed:', error);
    }
  }, [data]);

  return <Screen>
      <Form
      title="Iniciar Sesión"
      submitLabel="Iniciar Sesión"
      onSubmit={submitHandler}
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
    </Form>
  </Screen>;
}
