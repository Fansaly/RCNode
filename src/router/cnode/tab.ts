import { tabRegExp } from './RegExp';
import { cnodePath } from './routes';

export const navIsActive = (path: string, location: Location = {}) => {
  const { pathname, search } = location;
  return !!path && path === `${pathname}${search}`;
};

const navTabsObject = cnodePath.tab;
const navTabsArray: (RCNode.CNodePathProps & { key: RCNode.CNodeTab })[] = [];
const tabs: RCNode.CNodeTab[] = [];
const topicTabs: RCNode.CNodeTopicTab[] = [];

Object.entries(navTabsObject).forEach(([key, tab]) => {
  tabs.push(key as RCNode.CNodeTab);

  if (tab.isTopicTab) {
    topicTabs.push(key as RCNode.CNodeTopicTab);
  }

  navTabsArray.push({ ...tab, key: key as RCNode.CNodeTab });
});

export { navTabsArray, navTabsObject, tabs, topicTabs };

interface Location {
  pathname?: string;
  search?: string;
}

export const matchTab = (location: Location): RCNode.CNodeTab => {
  let { search = '' } = location;
  search = `/${search}`;
  const matches = search.match(tabRegExp);
  const tab = matches ? matches[1] : tabs[0];
  return tab as RCNode.CNodeTab;
};
