export default (location = {}) => {
  const { pathname, search = '' } = location;
  const tab = search.match(/\?tab=(\w+)/);

  return (
    tab
      ? tab[1]
      : pathname === '/'
        ? 'all'
        : null
  );
};
