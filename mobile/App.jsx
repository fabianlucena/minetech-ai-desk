import Toast, { BaseToast } from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import config from './config';
import GlobalProvider from './app/contexts/GlobalProvider';
import { ApiProvider } from './app/services/useApi';
import Main from './app/Main';

export const toastConfig = {
  warning: (props) => <BaseToast
    {...props}
    style={{ borderLeftColor: '#F4C300' }}
  />,
};

export default function App() {
  return <SafeAreaProvider>
    <KeyboardProvider>
      <GlobalProvider>
        <ApiProvider
          urlBase={config.apiUrl}
        >
          <Main />
          <Toast config={toastConfig} />
        </ApiProvider>
      </GlobalProvider>
    </KeyboardProvider>
  </SafeAreaProvider>;
}