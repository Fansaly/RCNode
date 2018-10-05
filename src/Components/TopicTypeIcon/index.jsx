import React from 'react';
import NotesIcon from '@material-ui/icons/Notes';
import TopIcon from '@material-ui/icons/Publish';
import GoodIcon from '@material-ui/icons/ThumbUp';
import QAIcon from '@material-ui/icons/Chat';
import ShareIcon from '@material-ui/icons/Share';
import JobIcon from '@material-ui/icons/Work';
import DevIcon from '@material-ui/icons/Build';
import UnknownIcon from '@material-ui/icons/HelpOutline';

class TopicTypeIcon extends React.Component {
  render() {
    const {
      all,
      good,
      top,
      tab,
      ...other
    } = this.props;

    let typeIcon = <UnknownIcon {...other} />;

    if (all) {
      typeIcon = <NotesIcon {...other} />;
    } else if (top) {
      typeIcon = <TopIcon {...other} />;
    } else if (good) {
      typeIcon = <GoodIcon {...other} />;
    } else {
      switch (tab) {
        case 'ask':
          typeIcon = <QAIcon {...other} />;
          break;
        case 'share':
          typeIcon = <ShareIcon {...other} />;
          break;
        case 'job':
          typeIcon = <JobIcon {...other} />;
          break;
        case 'dev':
          typeIcon = <DevIcon {...other} />;
          break;
        default:
          break;
      }
    }

    return typeIcon;
  }
}

export default TopicTypeIcon;
