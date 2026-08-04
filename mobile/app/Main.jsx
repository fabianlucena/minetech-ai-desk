import { useEffect } from 'react';
import useGlobal from './states/useGlobal';
import { autoLoginService } from './services/login.service';
import Api from './utils/api';
import { success, info, warning, error } from './components/Toast';

console.log(warning);

import InitiatingScreen from './screens/InitiatingScreen';
import Router from './Router';

export default function Main() {
  const { loading, updateSession, setLoading } = useGlobal();

  useEffect(() => {
    if (Api.authorizationToken) {
      setLoading(false);
      return;
    }

    autoLoginService()
      .then(res => {
        if (!res.roles.includes('technician')) {
          error(
            'Error no es un técnico',
            'No tienes permisos para acceder a esta aplicación'
          );
          throw new Error('No tienes permisos para acceder a esta aplicación');
        }
  
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