import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';

export default function Logout() {
  const navigate = useNavigate();
  const { updateSession } = useGlobal();
  const { addMessage, addWarning } = useToast();

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
      addMessage('Error al cerrar sesión', { severity: 'error' });
    }
  }, []);

  return <h6>Cerrando sesión...</h6>;
}