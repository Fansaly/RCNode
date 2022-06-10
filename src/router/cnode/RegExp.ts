import { cnodePath, cnodeURL } from './routes';

const gatherRegExp = (data: string[], capture = false) => {
  return data.map((v) => (capture ? `(${v})` : `(?:${v})`)).join('|');
};

const { tabRegExpStr, pathRegExpStr } = (() => {
  const home = '/?';
  const tabRegExpArr: string[] = [];
  const pathRegExpArr: string[] = [];

  for (const key in cnodePath) {
    if (key === 'tab') {
      const tabs = gatherRegExp(Object.keys(cnodePath[key]));
      tabRegExpArr.push(`/\\?(?:[^/])*?tab=(${tabs}).*`);
    } else {
      pathRegExpArr.push(`/${key}/\\w+(?:#\\w+)?`);
    }
  }

  return {
    tabRegExpStr: gatherRegExp(tabRegExpArr),
    pathRegExpStr: gatherRegExp([home, ...tabRegExpArr, ...pathRegExpArr]),
  };
})();

const tabRegExp = new RegExp(`^${tabRegExpStr}$`, 'i');
const pathRegExp = new RegExp(`^${pathRegExpStr}$`, 'i');

const urlRegExp = new RegExp(
  `^(http(?:s)?://)?(?:www.)?${cnodeURL}(${pathRegExpStr})$`,
  'i',
);

export { pathRegExp, tabRegExp, urlRegExp };
