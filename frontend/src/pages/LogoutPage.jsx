import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobal from '../states/useGlobal.jsx';
import useToast from '../states/useToast.jsx';

export default function LogoutPage() {
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
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h6>Cerrando sesión...</h6>;
}