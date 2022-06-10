import './app.styl';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';

import ThemeProvider from './components/Theme';
import Router from './router';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <CssBaseline />
          <Router />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
};

export default App;
