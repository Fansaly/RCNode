interface State {
  isChild: boolean;
  marked: boolean; // if `true' means self or parents used AuthRoute
  prarent?: RCNode.RouteProps;
}

export const generateRoutes = (
  routes: RCNode.RouteProps[],
  callback: (route: RCNode.RouteProps, state?: State) => void,
  state: State = { isChild: false, marked: false },
): RCNode.RouteProps[] => {
  const result: RCNode.RouteProps[] = [];

  if (!Array.isArray(routes)) {
    return result;
  }

  routes.forEach(({ ...route }) => {
    callback?.(route, state);

    if (state.isChild && route.path && route.path !== '/') {
      route.path = route.path.replace(/^\//, '');
    }

    route.children = generateRoutes(route.children as RCNode.RouteProps[], callback, {
      isChild: true,
      marked: route.meta?.marked || state.marked,
      prarent: route,
    });

    if (route.children.length === 0) {
      delete route.children;
    }

    result.push(route);
  });

  return result;
};
