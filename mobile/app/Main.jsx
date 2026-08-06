import { useEffect } from 'react';
import useGlobal from './contexts/useGlobal';
import useLogin from './services/useLogin';
import useApi from './services/useApi';
import { success, info, warning, error } from './components/Toast';

import InitiatingScreen from './screens/InitiatingScreen';
import Router from './Router';

export default function Main() {
  const { loading, updateSession, setLoading, clearSession } = useGlobal();
  const { autoLogin, setCredentials, clearCredentials } = useLogin();
  const api = useApi();

  useEffect(() => {
    if (!api.authorization) {
      setLoading(false);
      return;
    }

    autoLogin()
      .then(res => {
        if (!res?.roles?.includes('technician')) {
          error(
            'Error no es un técnico',
            'No tienes permisos para acceder a esta aplicación'
          );
          throw new Error('No tienes permisos para acceder a esta aplicación');
        }
  
        setCredentials(res);
        const result = updateSession(res);
        return result;
      })
      .then(() => {
        if (Api.authorizationToken) {
          success(
            'Bienvenido de nuevo',
            'Sesión iniciada correctamente'
          );
        } else {
          info(
            'Sesión no iniciada',
            'No se pudo iniciar sesión automáticamente'
          );
        }
      })
      .catch((err) => {
        clearCredentials();
        clearSession();
        warning(
          'Error al iniciar sesión',
          err.message || 'No se pudo iniciar sesión automáticamente'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <InitiatingScreen />;

  return <Router />;
}