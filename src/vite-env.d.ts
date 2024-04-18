/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />

declare module '@mui/private-theming' {
  import type { Theme } from '@mui/material/styles';
  type DefaultTheme = Theme;
}
