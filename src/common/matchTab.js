export default (location = { search: '' }) => {
  const rex = /\?tab=(\w+)/;
  const tab = location.search.match(rex);
  const { pathname } = location;

  return (
    tab
      ? tab[1]
      : pathname === '/'
        ? 'all'
        : null
  );
};
