import validateUUID from './validateUUID';
import { randomNumber } from './randomNumber';

import { navTabsArray, navTabsObject } from './navTabs';
import { navIsActive } from './navIsActive';
import { topicTypes } from './topicTypes';
import matchTab from './matchTab';

import removeHtmlTags from './removeHtmlTags';
import orgURIRexStr, {
  transformOrgURL,
} from './URI';

import {
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
} from './getNewData';

export {
  validateUUID,
  randomNumber,
  navTabsArray,
  navTabsObject,
  navIsActive,
  topicTypes,
  matchTab,
  removeHtmlTags,
  transformOrgURL,
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
};

export default orgURIRexStr;
