import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useCallback } from 'react';
import useGlobal from './contexts/useGlobal';
import useLogin from './services/useLogin';
import useApi from './services/useApi';
import { success, info, warning, error } from './components/Toast';

import InitiatingScreen from './screens/InitiatingScreen';
import Router from './Router';

export default function Main() {
  const { loading, updateSession, setLoading, clearSession } = useGlobal();
  const { autoLogin, canAutoLogin, setCredentials, clearCredentials } = useLogin();
  const api = useApi();

  const autoLoginHandler = useCallback(async () => {
    if (api.authorization) {
      setLoading(false);
      return;
    }

    if (!await canAutoLogin()) {
      setLoading(false);
      return;
    }

    try {
      const res = await autoLogin();
      if (!res?.authorizationToken) {
        info(
          'Sesión no iniciada',
          'No se pudo iniciar sesión automáticamente'
        );

        setLoading(false);
        return;
      }

      if (!res?.roles?.includes('technician')) {
        error(
          'Error no es un técnico',
          'No tienes permisos para acceder a esta aplicación'
        );

        setLoading(false);
        return;
      }

      await setCredentials(res);
      await updateSession(res);

      success(
        'Bienvenido de nuevo',
        'Sesión iniciada correctamente'
      );
    } catch(err) {
      await clearCredentials();
      await clearSession();
      warning(
        'Error al iniciar sesión',
        err.message || 'No se pudo iniciar sesión automáticamente'
      );
    }

    setLoading(false);
  });

  useEffect(() => {
    autoLoginHandler();
  }, []);

  if (loading)
    return <InitiatingScreen />;

  return <NavigationContainer>
    <Router />
  </NavigationContainer>;
}