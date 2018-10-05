import routers from '../routers';

let topicTypes = [];
const tabs = routers.tab;

for (let tab in tabs) {
  if (tabs[tab].isTopicType) {
    topicTypes.push(tab);
  }
}

export { topicTypes };
