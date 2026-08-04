import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import useSession from './states/useSession';

import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import TicketsScreen from './screens/TicketsScreen';

const Drawer = createDrawerNavigator();

export default function Router() {
  const { session } = useSession();
  const user = session.user;

  return <NavigationContainer>
    <Drawer.Navigator>
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
