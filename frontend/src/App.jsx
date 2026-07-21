import { useEffect, useCallback } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes.jsx';
import { autoLoginService, clearCredentials } from './services/login.service.js';
import { useGlobal } from './states/global.jsx';
import { useToast } from './states/toast.jsx';

export default function App() {
  const routes = useRoutes();
  const router = createBrowserRouter(routes);
  const { updateSession } = useGlobal();
  const { addInfo, addWarning } = useToast();

  const autoLogin = useCallback(async () => {
    try {
      const response = await autoLoginService();
      updateSession({
        user: response?.user ?? null,
        roles: response?.roles ?? null,
        permissions: response?.permissions ?? null,
      });
      addInfo('Sesión iniciada correctamente');
    } catch (error) {
      clearCredentials();
      updateSession({
        user: null,
        roles: null,
        permissions: null,
      });
      console.warn('Error al iniciar sesión:', error);
      addWarning('No se pudo iniciar sesión automáticamente');
    }
  }, [updateSession, addInfo]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />;
}