import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from '@react-native-vector-icons/material-icons';
import { success, error } from './components/Toast';

import useSession from './contexts/useSession';
import useLogin from './services/useLogin';

import CustomDrawer from './components/CustomDrawer';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import TicketsScreen from './screens/TicketsScreen';

const Drawer = createDrawerNavigator();

export default function Router() {
  const { session } = useSession();
  const { logout } = useLogin();
  const user = session.user;

  return <NavigationContainer>
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer
          {...props}
          buttons={[
            (user && {
              label: 'Cerrar sesión',
              icon: ({ size, color }) => <Icon name="logout" size={size} color={color} />,
              color: 'red',
              onPress: async () => {
                props.navigation.closeDrawer();
                try {
                  clearSession();
                  await logout();
                  success('Session cerrada correctamente');
                } catch (err) {
                  error('Error al cerrar sesión:', err.message || err);
                }                
              }
            })
          ].filter(Boolean)}
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
      
      {user && <>
        <Drawer.Screen
          name="chat"
          component={ChatScreen}
          options={{
            title: 'Chat',
            drawerLabel: 'Chats', // Nombre que aparece en el menú
            drawerIcon: ({ color, size }) => <Icon name="forum" size={size} color={color} />,
          }}
        />

        <Drawer.Screen
          name="tickets"
          component={TicketsScreen}
          options={{
            title: "Tickets",
            drawerLabel: "Tickets",
            drawerIcon: ({ color, size }) => (
                <Icon name="assignment" size={size} color={color} />
              ),
          }}
        />
      </>}
    </Drawer.Navigator>
  </NavigationContainer>;
}
