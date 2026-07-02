import { useGlobal } from './state/global.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';

export const allRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        label: 'Inicio',
        menuItemOrder: 1,
        element: <Home />,
      },
      {
        path: '/logout',
        label: 'Salir',
        menuItemOrder: 3,
        element: <Logout />,
        condition: global => !!global?.session?.user,
      },
      {
        path: '/dashboard',
        label: 'Dashboard',
        menuItemOrder: 2,
        element: <Dashboard />,
        condition: global => !!global?.session?.user,
      },
      {
        path: '/about',
        label: 'Acerca de',
        menuItemOrder: 99,
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  {
    path: '/login',
    label: 'Ingresar',
    menuItemOrder: 2,
    element: <Login />,
    condition: global => !global?.session?.user,
  },
];

export function getFilteredRoutes(routes = allRoutes, global) {
  return routes.map(route => {
    if (route.condition && !route.condition(global)) {
      return null;
    }

    route.id ??= crypto.randomUUID();
    if (!route.path) {
      if (route.index) {
        route.path = '/';
      } else {
        return null;
      }
    }

    const { children, ...rest } = route;
    const filteredChildren = children ? getFilteredRoutes(children, global) : undefined;
    return { ...rest, children: filteredChildren };
  }).filter(route => route !== null);
}

export function useRoutes() {
  const global = useGlobal();
  const routes = getFilteredRoutes(allRoutes, global);
  return routes;
}