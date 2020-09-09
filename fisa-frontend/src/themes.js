import { blue } from '@material-ui/core/colors';

const needetOptions = {
  '@global': {
    'html, body, #root': {
      height: '100vh',
    },
  },
};

export const lightTheme = {
  ...needetOptions,
  palette: {
    type: 'light',
    secondary: {
      main: blue[900],
    },
    background: {
      paper: '#f2f2f2',
      default: '#e6e6e6',
    },
  },
};

export const darkTheme = {
  ...needetOptions,
  palette: {
    type: 'dark',
    primary: {
      main: blue[200],
    },
    secondary: {
      main: blue[900],
    },
    background: {
      paper: '#2c313a',
      default: '#282c34',
    },
  },
};
