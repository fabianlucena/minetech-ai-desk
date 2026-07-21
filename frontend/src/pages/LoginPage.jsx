import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { TextField, PasswordField } from '../components/fields';
import Button from '../components/Button';
import { loginService } from '../services/login.service.js';
import { useGlobal } from '../states/global.jsx';
import { useToast } from '../states/toast.jsx';

export default function LoginPage() {
  const { updateSession } = useGlobal();
  const { addInfo, addError } = useToast();
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  async function onSubmit() {
    setDisabled(true);
    try {
      const response = await loginService(data);
      updateSession({
        user: response.user ?? null,
        roles: response.roles ?? null,
        permissions: response.permissions ?? null,
      });
      navigate('/dashboard');
      addInfo('Sesión iniciada correctamente');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      addError('Error al iniciar sesión: ' + (error.data?.message || error.message || error.data?.error));
    }
    setDisabled(false);
  }
  
  useEffect(() => {
    getOAuth2ProvidersService()
      .then(setProviders);
  }, []);

  return <Form
    title="Ingresar"
    description="Por favor, ingrese sus credenciales para continuar"
    disabled={disabled}
    disabledMessage="Iniciando sesión..."
    onSubmit={onSubmit}
    onCancel={() => navigate('/')}
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
      showHidePassword
      value={data.password}
      onChange={(e) => setData({...data, password: e.target.value})}
    />
    {providers.map(provider => (
      <Button
        key={provider.name}
        onClick={() => window.location.href = provider.url}
      >
        {provider.label ?? provider.displayName ?? provider.name}
      </Button>
    ))}
  </Form>;
}