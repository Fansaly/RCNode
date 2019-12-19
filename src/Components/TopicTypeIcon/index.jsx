import React from 'react';
import PropTypes from 'prop-types';

import NotesIcon from '@material-ui/icons/Notes';
import TopIcon from '@material-ui/icons/Publish';
import GoodIcon from '@material-ui/icons/ThumbUp';
import QAIcon from '@material-ui/icons/Chat';
import ShareIcon from '@material-ui/icons/Share';
import JobIcon from '@material-ui/icons/Work';
import DevIcon from '@material-ui/icons/Build';
import UnknownIcon from '@material-ui/icons/HelpOutline';

const TopicTypeIcon = (props) => {
  const {
    all,
    good,
    top,
    tab,
    ...rest
  } = props;

  let typeIcon = <UnknownIcon {...rest} />;

  if (all) {
    typeIcon = <NotesIcon {...rest} />;
  } else if (top) {
    typeIcon = <TopIcon {...rest} />;
  } else if (good) {
    typeIcon = <GoodIcon {...rest} />;
  } else {
    switch (tab) {
      case 'ask':
        typeIcon = <QAIcon {...rest} />;
        break;
      case 'share':
        typeIcon = <ShareIcon {...rest} />;
        break;
      case 'job':
        typeIcon = <JobIcon {...rest} />;
        break;
      case 'dev':
        typeIcon = <DevIcon {...rest} />;
        break;
      default:
        break;
    }
  }

  return typeIcon;
};

TopicTypeIcon.propTypes = {
  tab: PropTypes.string,
  all: PropTypes.bool,
  top: PropTypes.bool,
  good: PropTypes.bool,
};

export default TopicTypeIcon;
