import { Theme } from '@mui/material/styles';

export const lightTheme = {
  palette: {
    primary: {
      main: '#0082ea',
      dark: '#0376d2', // :hover
      light: '#2092ec',
    },
    background: {
      default: '#f4f4f4',
    },
  },
};

export const darkTheme = {
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) => ({
          boxShadow: theme.shadows[4],
        }),
      },
    },
  },
  palette: {
    primary: {
      main: '#0963ab',
      contrastText: '#ccc',
    },
    secondary: {
      main: '#ab003d',
      contrastText: '#ccc',
    },
    action: {
      active: '#ccc',
    },
    text: {
      primary: '#ccc',
    },
    background: {
      default: '#212121',
    },
    divider: 'rgba(128,128,128,.12)',
  },
};
