/// <reference types="vite/client" />

/// <reference types="vite-plugin-svgr/client" />

declare module '@mui/private-theming' {
  import type { Theme } from '@mui/material/styles';
  type DefaultTheme = Theme;
}
