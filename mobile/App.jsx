import Toast from 'react-native-toast-message';
import GlobalProvider from './app/states/GlobalProvider.jsx';
import Main from './app/Main';

export default function App() {
  return <GlobalProvider>
    <Main />
    <Toast />
  </GlobalProvider>;
}