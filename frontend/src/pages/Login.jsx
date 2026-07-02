import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import TextField from '../components/TextField';
import PasswordField from '../components/PasswordField';
import { loginService } from '../services/login.service.js';
import { useGlobal } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Login() {
  const { updateSession } = useGlobal();
  const { addMessage } = useToast();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    username: 'admin',
    password: '1234'
  });

  async function onSubmit() {
    setDisabled(true);
    await wait(2000);
    try {
      const response = await loginService(data);
      updateSession({
        user: response.user ?? null,
        roles: response.roles ?? null,
        permissions: response.permissions ?? null,
      });
      navigate('/dashboard');
      addMessage('Sesión iniciada correctamente');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      addMessage('Error al iniciar sesión', { severity: 'error' });
    }
    setDisabled(false);
  }

  return <Form
    title="Ingresar"
    description="Por favor, ingrese sus credenciales para continuar"
    disabled={disabled}
    disabledMessage="Iniciando sesión..."
    onSubmit={onSubmit}
    sx={{
      maxWidth: 400,
      margin: "auto",
    }}
  >
    <TextField
      label="Nombre de usuario"
      disabled={disabled}
      required
      autoFocus
      value={data.username}
      onChange={(e) => setData({...data, username: e.target.value})}
    />
    <PasswordField
      label="Contraseña"
      disabled={disabled}
      required
      value={data.password}
      onChange={(e) => setData({...data, password: e.target.value})}
    />
  </Form>;
}