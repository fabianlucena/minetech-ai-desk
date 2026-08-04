import Toast, { BaseToast } from 'react-native-toast-message';
import GlobalProvider from './app/states/GlobalProvider.jsx';
import Main from './app/Main';

export const toastConfig = {
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#F4C300' }}
    />
  ),
};

export default function App() {
  return <GlobalProvider>
    <Main />
    <Toast config={toastConfig} />
  </GlobalProvider>;
}