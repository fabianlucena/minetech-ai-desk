import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobal from '../contexts/useGlobal.jsx';
import useToast from '../contexts/useToast';
import useLogin from '../services/useLogin';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { updateSession } = useGlobal();
  const { clearCredentials } = useLogin();
  const { addWarning, addError } = useToast();

  useEffect(() => {
    try {
      clearCredentials();
      updateSession({
        user: null,
        roles: null,
        permissions: null,
      });
      navigate('/');
      addWarning('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      addError('Error al cerrar sesión: ' + (error.data?.message || error.message || error.data?.error));
    }
  }, [updateSession, navigate, addWarning, addError, clearCredentials]);

  return <h6>Cerrando sesión...</h6>;
}