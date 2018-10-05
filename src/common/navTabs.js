import routers from '../routers';

let navTabsArray = [];
let navTabsObject = {};
const tabs = routers.tab;

for (let tab in tabs) {
  if (typeof tabs !== 'object') {
    continue;
  }

  navTabsArray.push({
    ...tabs[tab],
    tab,
  });

  navTabsObject = {
    ...navTabsObject,
    [tab]: tabs[tab],
  };
}

export { navTabsArray, navTabsObject };
