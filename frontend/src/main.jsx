import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App.jsx';
import { mineTechTheme } from './theme/mineTechTheme';
import GlobalProvider from './contexts/GlobalProvider';
import { ApiProvider } from './services/useApi';
import ToastProvider from './contexts/ToastProvider';
import config from './config';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={mineTechTheme}>
      <ToastProvider>
        <ApiProvider
          urlBase={config.apiUrl}
        >
          <GlobalProvider>
            <App />
          </GlobalProvider>
        </ApiProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
