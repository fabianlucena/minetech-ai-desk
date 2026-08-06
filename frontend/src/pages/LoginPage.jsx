import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { TextField, PasswordField } from '../components/fields';
import Button from '../components/buttons/Button.jsx';
import useOAuth2provider from '../services/useOAuth2Provider';
import useGlobal from '../contexts/useGlobal.jsx';
import useLogin from '../services/useLogin';
import useToast from '../contexts/useToast';

export default function LoginPage() {
  const { updateSession } = useGlobal();
  const { addInfo, addError } = useToast();
  const { login } = useLogin();
  const { getOAuth2Providers } = useOAuth2provider();
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
      const response = await login(data);
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
    getOAuth2Providers()
      .then(setProviders)
      .catch(error => {
        console.error('Error al obtener los proveedores de OAuth2:', error);
        addError('Error al obtener los proveedores de autorización: ' + (error.data?.message || error.message || error.data?.error || error.error || 'Error desconocido'));
      });
  }, [addError, getOAuth2Providers]);

  return <Form
    title="Ingresar"
    description="Por favor, ingrese sus credenciales para continuar"
    disabled={disabled}
    disabledMessage="Iniciando sesión..."
    onSubmit={onSubmit}
    onCancel={() => navigate('/')}
    submitConfirmEnabled={false}
    cancelConfirmEnabled={false}
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