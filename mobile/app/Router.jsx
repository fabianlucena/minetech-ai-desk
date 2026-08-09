import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { success, error } from './components/Toast';
import Icon from './components/Icon';
import globalStyles from './global-styles';

import useSession from './contexts/useSession';
import useLogin from './services/useLogin';

import CustomDrawer from './components/CustomDrawer';
import ConversationsScreen from './screens/ConversationsScreen';
import LoginScreen from './screens/LoginScreen';
import TicketsScreen from './screens/TicketsScreen';
import ConversationMessagesScreen from './screens/ConversationMessagesScreen';

const Drawer = createDrawerNavigator();

export default function Router() {
  const navigation = useNavigation();
  const { session, clearSession } = useSession();
  const { logout } = useLogin();
  const user = session.user;
  const permissions = session.permissions || [];

  async function logoutHandler() {
    try {
      clearSession();
      await logout();
      success('Session cerrada correctamente');
    } catch (err) {
      error('Error al cerrar sesión:', err.message || err);
    }
  }

  return <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        ...globalStyles.header,
        title: undefined,
        icon: undefined,
      },
      headerTintColor: globalStyles.header.icon.color, 
      headerTitleStyle: {
        ...globalStyles.header.title,
      },
    }}
    drawerContent={(props) => (
      <CustomDrawer
        {...props}
        buttons={[
          (user && {
            label: 'Cerrar sesión',
            icon: ({ size, color }) => <Icon name="logout" size={size} color={color} />,
            color: 'red',
            onPress: logoutHandler,
          })
        ]}
      />
    )}
  >
    {!user && <Drawer.Screen
      name="login"
      component={LoginScreen}
      options={{
        title: 'Iniciar Sesión',
        drawerIcon: (props) => <Icon name="login" {...props} />,
      }}
    />}
    
    {permissions.includes('conversations.list') && <Drawer.Screen
      name="conversations"
      component={ConversationsScreen}
      options={{
        title: 'Conversaciones',
        drawerLabel: 'Conversaciones', // Nombre que aparece en el menú
        drawerIcon: (props) => <Icon name="forum" {...props} />,
      }}
    />}

    {permissions.includes('tickets.list') && <Drawer.Screen
      name="tickets"
      component={TicketsScreen}
      options={{
        title: "Tickets",
        drawerLabel: "Tickets",
        drawerIcon: (props) => <Icon name="assignment" {...props} />,
      }}
    />}

    {permissions.includes('conversations.list') && <Drawer.Screen
      name='messages'
      component={ConversationMessagesScreen}
      options={{
        title: 'Mensajes',
        drawerLabel: 'Mensajes',
        drawerItemStyle: { display: 'none' },
        showMenu: false,
        headerLeft: () => <Icon
          name="arrow-back-ios"
          style={globalStyles.header.icon}
          onPress={() => navigation.goBack()}
        />,
      }}
    />}
  </Drawer.Navigator>;
}
