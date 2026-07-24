import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { mineTechTheme } from './theme/mineTechTheme';
import GlobalProvider from './states/GlobalProvider.jsx';
import ToastProvider from './states/ToastProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={mineTechTheme}>
      <ToastProvider>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
