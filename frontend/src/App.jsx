import { useEffect, useCallback } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes.jsx';
import useLogin from './services/useLogin';
import useGlobal from './states/useGlobal.jsx';
import useToast from './states/useToast.jsx';

export default function App() {
  const routes = useRoutes();
  const router = createBrowserRouter(routes);
  const { updateSession, clearSession } = useGlobal();
  const { addInfo, addWarning } = useToast();
  const { autoLogin, clearCredentials } = useLogin();

  const autoLoginHandler = useCallback(async () => {
    try {
      const response = await autoLogin();
      updateSession({
        user: response?.user ?? null,
        roles: response?.roles ?? null,
        permissions: response?.permissions ?? null,
      });
      addInfo('Sesión iniciada correctamente');
    } catch (error) {
      clearCredentials();
      clearSession();
      console.warn('Error al iniciar sesión:', error);
      addWarning('No se pudo iniciar sesión automáticamente');
    }
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    autoLoginHandler();
  }, [autoLoginHandler]);

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />;
}