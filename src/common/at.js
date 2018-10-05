export const at = content => {
  return (
    typeof content === 'string'
      ? content
        .replace(/\[(@[\w\-_]+)\]\(\/user\/[\w\-_]+\)/g, '$1')
        .replace(/(@([\w\-_]+))/g, '[$1](/user/$2)')
      : ''
  );
};
