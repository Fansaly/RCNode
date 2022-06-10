import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// https://github.com/mui/material-ui/blob/master/packages/mui-system/src/createTheme/createBreakpoints.d.ts
export type Action = 'up' | 'down' | 'only' | 'not' | 'between';
// export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const useBreakpoints = (action: Action, start: any, end?: any) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints[action](start, end));
};

export default useBreakpoints;
