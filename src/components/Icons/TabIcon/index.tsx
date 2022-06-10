import DevIcon from '@mui/icons-material/Build';
import QAIcon from '@mui/icons-material/Chat';
import UnknownIcon from '@mui/icons-material/Help';
import NotesIcon from '@mui/icons-material/Notes';
import TopIcon from '@mui/icons-material/Publish';
import ShareIcon from '@mui/icons-material/Share';
import GoodIcon from '@mui/icons-material/ThumbUp';
import JobIcon from '@mui/icons-material/Work';
import { SvgIconProps } from '@mui/material/SvgIcon';

interface Props extends SvgIconProps {
  tab?: RCNode.CNodeTab;
  all?: boolean;
  top?: boolean;
  good?: boolean;
}

const TabIcon = ({ all, good, top, tab, ...rest }: Props) => {
  let Icon = UnknownIcon;

  if (all) {
    Icon = NotesIcon;
  } else if (top) {
    Icon = TopIcon;
  } else if (good) {
    Icon = GoodIcon;
  } else {
    switch (tab) {
      case 'ask':
        Icon = QAIcon;
        break;
      case 'share':
        Icon = ShareIcon;
        break;
      case 'job':
        Icon = JobIcon;
        break;
      case 'dev':
        Icon = DevIcon;
        break;
      default:
        break;
    }
  }

  return <Icon {...rest} />;
};

export default TabIcon;
