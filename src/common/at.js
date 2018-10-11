export const at = content => {
  return (
    typeof content === 'string'
      ? content
        .replace(/\[(@[\w\-_]+)\]\(\/user\/[\w\-_]+\)/g, '$1')
        .replace(/^(@([\w\-_]+))$/, '[$1](/user/$2)')
        .replace(/(\s+)(@([\w\-_]+))/g, '$1[$2](/user/$3)')
        .replace(/(@([\w\-_]+))(\s+)/g, '[$1](/user/$2)$3')
      : ''
  );
};
