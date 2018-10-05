export const navIsActive = (path, location = {}) => {
  const { pathname, search } = location;
  return !!path && path === `${pathname}${search}`;
};
