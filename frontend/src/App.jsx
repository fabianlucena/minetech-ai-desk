import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes.jsx';
import { autoLoginService } from './services/login.service.js';
import { useGlobal } from './state/global.jsx';
import { useToast } from './state/toast.jsx';

export default function App() {
  const routes = useRoutes();
  const router = createBrowserRouter(routes);
  const { updateSession } = useGlobal();
  const { addInfo, addWarning } = useToast();

  async function autoLogin() {
    try {
      const response = await autoLoginService();
      updateSession({
        user: response.user ?? null,
        roles: response.roles ?? null,
        permissions: response.permissions ?? null,
      });
      addInfo('Sesión iniciada correctamente');
    } catch (error) {
      updateSession({
        user: null,
        roles: null,
        permissions: null,
      });
      console.warn('Error al iniciar sesión:', error);
      addWarning('No se pudo iniciar sesión automáticamente');
    }
  }

  useEffect(() => {
    autoLogin();
  }, []);

  return <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
    }}
  />;
}