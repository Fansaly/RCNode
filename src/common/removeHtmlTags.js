export default (str) => {
  return str.replace(/<[^>]+>/g, '');
};
