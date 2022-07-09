import { tabRegExp } from './RegExp';
import { cnodePath, CNodeTab, PathProps, TopicTab } from './routes';

export const navIsActive = (path: string, location: Location = {}): boolean => {
  const { pathname, search } = location;
  return !!path && path === `${pathname}${search}`;
};

const navTabsObject = cnodePath.tab;
const navTabsArray: (PathProps & { key: CNodeTab })[] = [];
const tabs: CNodeTab[] = [];
const topicTabs: TopicTab[] = [];

Object.entries(navTabsObject).forEach((item) => {
  const [key, tab] = item as [CNodeTab, PathProps];

  navTabsArray.push({ ...tab, key });
  tabs.push(key);

  if (tab.isTopicTab) {
    topicTabs.push(key as TopicTab);
  }
});

export { navTabsArray, navTabsObject, tabs, topicTabs };

interface Location {
  pathname?: string;
  search?: string;
}

export const matchTab = (location: Location): CNodeTab => {
  let { search = '' } = location;
  search = `/${search}`;
  const matches = search.match(tabRegExp);
  const tab = matches ? matches[1] : tabs[0];
  return tab as CNodeTab;
};
