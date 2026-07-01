import { createTheme } from '@mui/material/styles';

export const mineTechTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#F4C300',       // Amarillo MineTech
      contrastText: '#1A1A1A'
    },

    secondary: {
      main: '#D62828',       // Rojo MineTech
      contrastText: '#FFFFFF'
    },

    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A'
    },

    background: {
      default: '#FFFFFF',
      paper: '#F9F9F9'
    }
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },

    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A', // Negro técnico
          color: '#FFFFFF',
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});
