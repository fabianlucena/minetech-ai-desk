import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import GlobalProvider from './app/states/GlobalProvider.jsx';

import HomeScreen from './app/screens/HomeScreen';
import ChatScreen from './app/screens/ChatScreen';
import LoginScreen from './app/screens/LoginScreen';
import TicketsScreen from './app/screens/TicketsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const user = false;

  return <NavigationContainer>
    <GlobalProvider>
      <Drawer.Navigator>
        <Drawer.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: "Inicio"
          }}
        />

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
              drawerLabel: "Panel Principal" // Nombre que aparece en el menú
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
    </GlobalProvider>
  </NavigationContainer>;
}
