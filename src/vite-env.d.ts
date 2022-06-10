/// <reference types="vite/client" />

/// <reference types="vite-plugin-svgr/client" />

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L845-L847
declare namespace React {
  function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): T;
}

declare module '@mui/private-theming' {
  import type { Theme } from '@mui/material/styles';
  type DefaultTheme = Theme;
}
