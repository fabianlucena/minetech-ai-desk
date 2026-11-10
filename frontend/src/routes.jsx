import { useMemo } from 'react';
import useGlobal from './contexts/useGlobal';
import { AboutIcon, ClientIcon, ConversationIcon, DashboardIcon, HomeIcon, 
  LoginIcon, LogoutIcon, RequesterIcon, SettingsIcon, ShiftIcon, TechnicianIcon, 
  TicketIcon, UsersIcon, DocumentsIcon
} from './components/icons/index';
import MainLayout from './layouts/MainLayout';
import SimpleLayout from './layouts/SimpleLayout';
import HomePage from './pages/HomePage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import UserChangePasswordPage from './pages/UserChangePasswordPage';
import TechniciansPage from './pages/TechniciansPage';
import TechnicianPage from './pages/TechnicianPage';
import ClientsPage from './pages/ClientsPage';
import ClientPage from './pages/ClientPage';
import RequestersPage from './pages/RequestersPage';
import ConversationsPage from './pages/ConversationsPage';
import ConversationMessagesPage from './pages/ConversationMessagesPage';
import ShiftsPage from './pages/ShiftsPage';
import SettingsPage from './pages/SettingsPage';
import SettingPage from './pages/SettingPage';
import TicketsPage from './pages/TicketsPage';
import RagDocumentsPage from './pages/RagDocumentsPage';
import RagDocumentPage from './pages/RagDocumentPage';

export const allRoutes = [
  {
    path: '/',
    element: <MainLayout />,
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
        path: '/tickets',
        label: 'Tickets',
        icon: <TicketIcon />,
        menuItemOrder: 3,
        element: <TicketsPage />,
        condition: ({ permissions }) => permissions.includes('tickets.list'),
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
        path: '/conversations',
        label: 'Conversaciones',
        icon: <ConversationIcon />,
        menuItemOrder: 3,
        element: <ConversationsPage />,
        condition: ({ permissions }) => permissions.includes('conversations.list'),
      },
      {
        path: '/conversations/:uuid/messages',
        element: <ConversationMessagesPage />,
        condition: ({ permissions }) => permissions.includes('conversationMessages.read'),
      },
      {
        path: '/rag-documents',
        label: 'Documentos',
        icon: <DocumentsIcon />,
        menuItemOrder: 3,
        element: <RagDocumentsPage />,
        condition: ({ permissions }) => permissions.includes('ragDocuments.list'),
      },
      {
        path: '/rag-documents/new',
        element: <RagDocumentPage />,
        condition: ({ permissions }) => permissions.includes('ragDocuments.create'),
      },
      {
        path: '/rag-documents/:uuid/edit',
        element: <RagDocumentPage />,
        condition: ({ permissions }) => permissions.includes('ragDocuments.update'),
      },
      {
        path: '/settings',
        label: 'Configuración',
        icon: <SettingsIcon />,
        menuItemOrder: 3,
        element: <SettingsPage />,
        condition: ({ permissions }) => permissions.includes('settings.list'),
      },
      {
        path: '/settings/new',
        element: <SettingPage />,
        condition: ({ permissions }) => permissions.includes('settings.create'),
      },
      {
        path: '/settings/:uuid/edit',
        element: <SettingPage />,
        condition: ({ permissions }) => permissions.includes('settings.update'),
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
        path: '/error',
        element: <ErrorPage />,
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
    element: <SimpleLayout>
        <LoginPage />
      </SimpleLayout>,
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
  const routes = useMemo(() => getFilteredRoutes(allRoutes, global), [global]);
  return routes;
}