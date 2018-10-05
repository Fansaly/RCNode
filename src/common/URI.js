import routers from '../routers';

const cnodeURL = 'cnodejs.org';

const formatArr = arr => {
  if (arr instanceof Array) {
    return arr.map(value => {
      return `(${value})`;
    }).join('|');
  }
};

const orgURIRexStr = (() => {
  let _orgURIRexStr = [ '/?' ];

  for (let key in routers) {
    if (key === 'tab') {
      _orgURIRexStr.push(`/\\?tab=(${formatArr(Object.keys(routers[key]))})`);
    } else {
      _orgURIRexStr.push(`/${key}/\\w+`);
    }
  }

  return formatArr(_orgURIRexStr);
})();

const transformOrgURL = string => {
  const restr = `^(http(s)?://)?(www.)?${cnodeURL}(${orgURIRexStr})$`;
  const regex = new RegExp(restr, 'i');

  return string.replace(regex, ($0, $1, $2, $3, $4) => {
    let baseURL = cnodeURL;

    if (typeof window !== 'undefined') {
      $1 = $1 && `${window.location.protocol}//`;
      baseURL = window.location.host;
    }

    $1 = $1 || '';

    return `${$1}${baseURL}${process.env.PUBLIC_URL}${$4}`;
  });
};

export { transformOrgURL };
export default orgURIRexStr;
