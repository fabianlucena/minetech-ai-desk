import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';

export default function Logout() {
  const navigate = useNavigate();
  const { updateSession } = useGlobal();
  const { addWarning, addError } = useToast();

  useEffect(() => {
    try {
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
  }, []);

  return <h6>Cerrando sesión...</h6>;
}