import { useGlobal } from './state/global.jsx';
import { HomeIcon, DashboardIcon, UsersIcon, AboutIcon, LoginIcon, LogoutIcon, TechnicianIcon, ClientIcon, RequesterIcon, ShiftIcon } from './components/icons/index.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage.jsx';
import LoginPage from './pages/Login.jsx';
import LogoutPage from './pages/LogoutPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/Users.jsx';
import UserPage from './pages/UserPage.jsx';
import UserChangePasswordPage from './pages/UserChangePassword.jsx';
import TechniciansPage from './pages/TechniciansPage.jsx';
import TechnicianPage from './pages/TechnicianPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ClientPage from './pages/ClientPage.jsx';
import RequestersPage from './pages/RequestersPage.jsx';
import ShiftsPage from './pages/ShiftsPage.jsx';

export const allRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/oauth2callback/:name/:action',
        element: <OAuth2CallbackPage />,
      },
      {
        index: true,
        label: 'Inicio',
        icon: <HomeIcon />,
        menuItemOrder: 1,
        element: <HomePage />,
      },
      {
        path: '/dashboard',
        label: 'Panel de control',
        icon: <DashboardIcon />,
        menuItemOrder: 2,
        element: <DashboardPage />,
        condition: ({ user }) => !!user,
      },
      {
        path: '/users',
        label: 'Usuarios',
        icon: <UsersIcon />,
        menuItemOrder: 3,
        element: <UsersPage />,
        condition: ({ permissions }) => permissions.includes('users.list'),
      },
      {
        path: '/users/new',
        element: <UserPage />,
        condition: ({ permissions }) => permissions.includes('users.create'),
      },
      {
        path: '/users/:uuid/edit',
        element: <UserPage />,
        condition: ({ permissions }) => permissions.includes('users.update'),
      },
      {
        path: '/users/:uuid/change-password',
        element: <UserChangePasswordPage />,
        condition: ({ permissions }) => permissions.includes('users.update'),
      },
      {
        path: '/technicians',
        label: 'Técnicos',
        icon: <TechnicianIcon />,
        menuItemOrder: 3,
        element: <TechniciansPage />,
        condition: ({ permissions }) => permissions.includes('technicians.list'),
      },
      {
        path: '/technicians/new',
        element: <TechnicianPage />,
        condition: ({ permissions }) => permissions.includes('technicians.create'),
      },
      {
        path: '/technicians/:uuid/edit',
        element: <TechnicianPage />,
        condition: ({ permissions }) => permissions.includes('technicians.update'),
      },
      {
        path: '/shifts',
        label: 'Turnos',
        icon: <ShiftIcon />,
        menuItemOrder: 3,
        element: <ShiftsPage />,
        condition: ({ permissions }) => permissions.includes('shifts.list'),
      },
      {
        path: '/clients',
        label: 'Clientes',
        icon: <ClientIcon />,
        menuItemOrder: 3,
        element: <ClientsPage />,
        condition: ({ permissions }) => permissions.includes('clients.list'),
      },
      {
        path: '/clients/new',
        element: <ClientPage />,
        condition: ({ permissions }) => permissions.includes('clients.create'),
      },
      {
        path: '/clients/:uuid/edit',
        element: <ClientPage />,
        condition: ({ permissions }) => permissions.includes('clients.update'),
      },
      {
        path: '/requesters',
        label: 'Solicitantes',
        icon: <RequesterIcon />,
        menuItemOrder: 3,
        element: <RequestersPage />,
        condition: ({ permissions }) => permissions.includes('requesters.list'),
      },
      {
        path: '/about',
        label: 'Acerca de',
        icon: <AboutIcon />,
        menuItemOrder: 98,
        element: <AboutPage />,
      },
      {
        path: '/logout',
        label: 'Salir',
        icon: <LogoutIcon />,
        menuItemOrder: 99,
        element: <LogoutPage />,
        condition: ({ user }) => !!user,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  {
    path: '/login',
    label: 'Ingresar',
    icon: <LoginIcon />,
    menuItemOrder: 2,
    element: <LoginPage />,
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