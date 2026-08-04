import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { success, error } from './components/Toast';

import useSession from './states/useSession';
import { logoutService } from './services/login.service';

import CustomDrawer from './components/CustomDrawer';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import TicketsScreen from './screens/TicketsScreen';

const Drawer = createDrawerNavigator();

export default function Router() {
  const { session, setSession } = useSession();
  const user = session.user;

  return <NavigationContainer>
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer
          {...props}
          buttons={[
            {
              label: 'Cerrar sesión',
              color: 'red',
              onPress: async () => {
                props.navigation.closeDrawer();
                try {
                  setSession({});
                  await logoutService();
                  success('Session cerrada correctamente');
                } catch (err) {
                  error('Error al cerrar sesión:', err.message || err);
                }                
              }
            }
          ]}
        />
      )}
    >
      {!user && <Drawer.Screen
        name="login"
        component={LoginScreen}
        options={{
          title: "Iniciar Sesión"
        }}
      />}
      
      {user && <>
        <Drawer.Screen
          name="chat"
          component={ChatScreen}
          options={{
            title: "Chat",
            drawerLabel: "Chats" // Nombre que aparece en el menú
          }}
        />

        <Drawer.Screen
          name="tickets"
          component={TicketsScreen}
          options={{
            title: "Tickets",
            drawerLabel: "Gestionar Tickets"
          }}
        />
      </>}
    </Drawer.Navigator>
  </NavigationContainer>;
}
