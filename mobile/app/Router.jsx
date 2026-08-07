import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from '@react-native-vector-icons/material-icons';
import { success, error } from './components/Toast';

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
        drawerIcon: ({ color, size }) => <Icon name="login" size={size} color={color} />,
      }}
    />}
    
    {permissions.includes('conversations.list') && <Drawer.Screen
      name="conversations"
      component={ConversationsScreen}
      options={{
        title: 'Conversaciones',
        drawerLabel: 'Conversaciones', // Nombre que aparece en el menú
        drawerIcon: ({ color, size }) => <Icon name="forum" size={size} color={color} />,
      }}
    />}

    {permissions.includes('tickets.list') && <Drawer.Screen
      name="tickets"
      component={TicketsScreen}
      options={{
        title: "Tickets",
        drawerLabel: "Tickets",
        drawerIcon: ({ color, size }) => <Icon name="assignment" size={size} color={color} />,
      }}
    />}

    {permissions.includes('conversations.list') && <Drawer.Screen
      name='messages'
      component={ConversationMessagesScreen}
      options={{
        headerStyle: {
          backgroundColor: '#666',
          elevation: 0, // Android
          shadowOpacity: 0, // iOS
        },
        headerTintColor: '#ddd',
        title: 'Mensajes',
        drawerLabel: 'Mensajes',
        drawerItemStyle: { display: 'none' },
        showMenu: false,
        headerLeft: () => <Icon
          name="arrow-back-ios"
          size={22}
          style={{ marginLeft: 12 }}
          onPress={() => navigation.goBack()}
        />,
      }}
    />}
  </Drawer.Navigator>;
}
