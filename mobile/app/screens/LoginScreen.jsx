import { useState, useCallback } from 'react';
import { success, error } from '../components/Toast';
import Screen from '../components/Screen';
import Form from '../components/Form';
import TextField from '../components/TextField';
import { loginService } from '../services/login.service';
import useGlobal from '../states/useGlobal';

export default function LoginScreen() {
  const { updateSession } = useGlobal();
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const submitHandler = useCallback(async () => {
    try {
      const res = await loginService(data);
      if (!res.roles.includes('technician')) {
        error(
          'Error no es un técnico',
          'No tienes permisos para acceder a esta aplicación'
        );
        return;
      }
      
      await updateSession(res);
      success(
        'Bienvenido de nuevo',
        'Has iniciado sesión correctamente'
      );
    }
    catch (err) {
      error(
        'Error al iniciar sesión',
        err.message || 'No se pudo iniciar sesión'
      );
    }
  }, [data]);

  return <Screen>
      <Form
      title="Iniciar Sesión"
      submitLabel="Iniciar Sesión"
      onSubmit={submitHandler}
      canSubmit={data.username && data.password}
    >
      <TextField
        label="Nombre de usuario"
        required
        value={data.username}
        onChangeText={(value) => setData({ ...data, username: value })}
        placeholder="Escriba aquí su nombre de usuario"
      />
      <TextField
        label="Contraseña"
        required
        value={data.password}
        onChangeText={(value) => setData({ ...data, password: value })}
        placeholder="Escriba aquí su contraseña"
        secureTextEntry
      />
    </Form>
  </Screen>;
}
