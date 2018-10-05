import validateUUID from './validateUUID';

import { navTabsArray, navTabsObject } from './navTabs';
import { navIsActive } from './navIsActive';
import { topicTypes } from './topicTypes';
import matchTab from './matchTab';

import removeHtmlTags from './removeHtmlTags';
import orgURIRexStr, {
  transformOrgURL,
} from './URI';
import { at } from './at';

import {
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
} from './getNewData';

export {
  validateUUID,
  navTabsArray,
  navTabsObject,
  navIsActive,
  topicTypes,
  matchTab,
  removeHtmlTags,
  transformOrgURL,
  at,
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
};

export default orgURIRexStr;
