import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import TextField from '../components/TextField';
import PasswordField from '../components/PasswordField';
import { loginService } from '../services/login.service.js';
import { useGlobal } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';

export default function Login() {
  const { updateSession } = useGlobal();
  const { addMessage } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  async function onSubmit() {
    addMessage('Iniciando sesión...');
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
      addMessage('Error al iniciar sesión', { severity: 'error' });
    }
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