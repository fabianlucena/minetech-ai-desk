import { useGlobal } from './state/global.jsx';
import { HomeIcon, DashboardIcon, UsersIcon, AboutIcon, LoginIcon, LogoutIcon } from './components/icons/index.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import User from './pages/User.jsx';
import UserChangePassword from './pages/UserChangePassword.jsx';

export const allRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        label: 'Inicio',
        icon: <HomeIcon />,
        menuItemOrder: 1,
        element: <Home />,
      },
      {
        path: '/dashboard',
        label: 'Panel de control',
        icon: <DashboardIcon />,
        menuItemOrder: 2,
        element: <Dashboard />,
        condition: ({ user }) => !!user,
      },
      {
        path: '/users',
        label: 'Usuarios',
        icon: <UsersIcon />,
        menuItemOrder: 3,
        element: <Users />,
        condition: ({ permissions }) => permissions.includes('users.list'),
      },
      {
        path: '/users/new',
        element: <User />,
        condition: ({ permissions }) => permissions.includes('users.create'),
      },
      {
        path: '/users/:uuid/change-password',
        element: <UserChangePassword />,
        condition: ({ permissions }) => permissions.includes('users.update'),
      },
      {
        path: '/users/:uuid/edit',
        element: <User />,
        condition: ({ permissions }) => permissions.includes('users.update'),
      },
      {
        path: '/about',
        label: 'Acerca de',
        icon: <AboutIcon />,
        menuItemOrder: 98,
        element: <About />,
      },
      {
        path: '/logout',
        label: 'Salir',
        icon: <LogoutIcon />,
        menuItemOrder: 99,
        element: <Logout />,
        condition: ({ user }) => !!user,
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
    icon: <LoginIcon />,
    menuItemOrder: 2,
    element: <Login />,
    condition: ({ user }) => !user,
  },
];

export function getFilteredRoutes(routes = allRoutes, global) {
  const session = global?.session;
  const user = session?.user;
  const permissions = session?.permissions || [];

  return routes.map(route => {
    if (route.condition && !route.condition({ global, session, user, permissions })) {
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