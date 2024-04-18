import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { useSelector } from '@/store';

import { darkTheme, lightTheme } from './theme';

export const useSystemColorMode = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  return prefersDarkMode ? 'dark' : 'light';
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorMode = useSystemColorMode();
  const settings = useSelector((state) => state.settings);
  const mode = settings.autoFollow ? systemColorMode : settings.theme;

  React.useEffect(() => {
    const element = document?.querySelector(':root');
    if (element) {
      element.setAttribute('color-scheme', mode);
    }
  }, [mode]);

  const theme = React.useMemo(() => {
    const theme = mode === 'light' ? lightTheme : darkTheme;
    return createTheme({ ...theme, palette: { ...theme.palette, mode } });
  }, [mode]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
