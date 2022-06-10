import React from 'react';
import {
  matchRoutes,
  Navigate,
  Outlet,
  useLocation,
  useRoutes as useRouterRoutes,
} from 'react-router-dom';

import { useSelector } from '@/store';

import { generateRoutes } from './helper';
import originalRoutes, { standRoutes } from './routes';

type Status = 'normal' | 'updating' | 'success' | 'failed';

const RoutesContext = React.createContext<{
  routes: RCNode.RouteProps[];
  status: Status;
}>({
  routes: [],
  status: 'normal',
});

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthed } = useSelector((state) => state.auth);
  const location = useLocation();

  return isAuthed ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

const ElementRoutes = ({ routes }: { routes: RCNode.RouteProps[] }) => {
  return useRouterRoutes(routes);
};

const Routes = () => {
  const { isAuthed } = useSelector((state) => state.auth);
  const [currentRoutes, setCurrentRoutes] = React.useState<RCNode.RouteProps[]>([]);
  const [normalRoutes, setNormalRoutes] = React.useState<RCNode.RouteProps[]>([]);
  const [simpleRoutes, setSimpleRoutes] = React.useState<RCNode.RouteProps[]>([]);
  const [status, setStatus] = React.useState<Status>('normal');

  const generateElementRoutes = (routes: RCNode.RouteProps[]) => {
    return generateRoutes(routes, (route, state) => {
      const Component = route.element || (() => null);
      const auth = route.meta?.auth || false;

      if (auth && !state?.marked) {
        const meta = route.meta || {};
        meta.marked = true; // mark AuthRoute top-level position
      }

      route.element = route.meta?.marked ? (
        <AuthRoute>
          <React.Fragment>
            <Component />
            <Outlet />
          </React.Fragment>
        </AuthRoute>
      ) : (
        <React.Fragment>
          <Component />
          <Outlet />
        </React.Fragment>
      );
    });
  };

  // normal
  React.useEffect(() => {
    const elementRoutes = generateElementRoutes(originalRoutes);
    setCurrentRoutes(elementRoutes);
    setNormalRoutes(elementRoutes);
    setStatus('normal');
  }, []);

  // signin
  // fetch async/auth routes and merge
  // currentRoutes contains normalRoutes
  React.useEffect(() => {
    if (!isAuthed || status === 'success') {
      return;
    }

    (async () => {
      setStatus('updating');

      const fetchAuthRoutes = (): Promise<RCNode.RouteProps[]> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve([...standRoutes]);
          }, 0.5 * 1e3);
        });
      };

      const authRoutes = await fetchAuthRoutes();
      const elementRoutes = generateElementRoutes([...originalRoutes, ...authRoutes]);

      setCurrentRoutes(elementRoutes);
      setStatus('success');
    })();
  }, [isAuthed, status]);

  // signout
  React.useEffect(() => {
    if (isAuthed || status !== 'success') {
      return;
    }

    setCurrentRoutes(normalRoutes);
    setStatus('normal');
  }, [isAuthed, status]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    let routes = JSON.parse(JSON.stringify(currentRoutes));
    routes = generateRoutes(routes, (route) => {
      delete route.element;
    });

    setSimpleRoutes(routes);
  }, [currentRoutes]);

  // render dynamic routes
  return (
    <RoutesContext.Provider value={{ routes: simpleRoutes, status }}>
      {currentRoutes.length > 0 ? <ElementRoutes routes={currentRoutes} /> : null}
    </RoutesContext.Provider>
  );
};

export default Routes;

export const useRoutes = () => {
  return React.useContext(RoutesContext);
};

export const useCurrentRoute = () => {
  const { routes } = useRoutes();
  const location = useLocation();
  const result = matchRoutes(routes, location);

  if (Array.isArray(result)) {
    const index = Math.max(0, result.length - 1);
    return result[index];
  }
};

export const useCurrentMeta = (): RCNode.Meta => {
  const result = useCurrentRoute();
  let meta = {};

  if (result) {
    const { route } = result;
    meta = (route as RCNode.RouteProps).meta || {};
  }

  return meta;
};
