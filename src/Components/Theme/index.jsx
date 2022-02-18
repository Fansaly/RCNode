import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { setPrismTheme, lightPrismTheme, darkPrismTheme } from '../Prism';
import { lightThemeOptions, darkThemeOptions } from './themeOptions';

export const useSystemThemeMode = () => {
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  return prefersLightMode ? 'light' : 'dark';
};

const ThemeProvider = (props) => {
  const systemThemeMode = useSystemThemeMode();
  const { autoFollow, themeMode } = useSelector(state => state.settings);
  const paletteType = autoFollow ? systemThemeMode : themeMode;

  React.useEffect(() => {
    setPrismTheme(paletteType === 'light' ? lightPrismTheme : darkPrismTheme);
  }, [paletteType]);

  const theme = React.useMemo(() => (createTheme({
    palette: {
      ...(paletteType === 'light' ? lightThemeOptions : darkThemeOptions),
      type: paletteType,
    },
  })), [paletteType]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.theme = theme;
    }
  }, [theme]);

  return (
    <MuiThemeProvider theme={theme}>
      {props.children}
    </MuiThemeProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
