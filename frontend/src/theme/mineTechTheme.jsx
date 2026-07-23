import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid/locales';

export const mineTechTheme = createTheme(
  {
    palette: {
      mode: 'light',

      primary: {
        main: '#F4C300',       // Amarillo MineTech
        contrastText: '#4A4A4A',
      },

      secondary: {
        main: '#888888', //'#D62828',       // Rojo MineTech
        contrastText: '#FFFFFF',
      },

      text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
      },

      background: {
        default: '#FFFFFF',
        paper: '#F9F9F9',
      },
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
        fontWeight: 600,
      },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1A1A1A', // Negro técnico
            color: '#888888',
            position: 'static',
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            '&.default': {
              color: '#D62828',
            },
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',                // color del texto del menú
            backgroundColor: '#888888',
            paddingLeft: 16,
            paddingRight: 16,
            transition: 'background-color 0.2s ease',

            '&:hover': {
              backgroundColor: '#D62828',    // rojo MineTech
              color: '#FFFFFF',
            },

            '&.Mui-selected': {
              backgroundColor: '#F4C300',    // amarillo MineTech
              color: '#1A1A1A',
            },

            '&.Mui-selected:hover': {
              backgroundColor: '#D62828',    // hover del seleccionado
              color: '#FFFFFF',
            }
          }
        }
      },

      MuiDataGrid: {
        styleOverrides: {
          columnHeaders: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.primary,
          }),

          cell: {
            display: 'flex',
            alignItems: 'center',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: '1px solid #888',
            height: 24,
          },
        },
      },
    },
  },
  esES,
);
