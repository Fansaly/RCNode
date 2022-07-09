import './header.styl';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PreviewIcon from '@mui/icons-material/LocalLibrary';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

import Avatar from '@/components/Avatar';
import { TabIcon } from '@/components/Icons';
import { navTabsObject as navTabs, topicTabs } from '@/router';
import { useSelector } from '@/store';

const useStyles = makeStyles((theme) => ({
  dragEnabled: {
    cursor: 'move',
  },
  color: {
    color: theme.palette.mode === 'light' ? '#0366d6' : '#1858a0',
    '& svg': {
      color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.58)' : 'rgba(230,230,230,.58)',
    },
  },
  text: {
    padding: 0,
    paddingRight: 2,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 0,
    '& h6': {
      fontSize: '1.125rem',
    },
  },
  back: {
    marginLeft: -14,
  },
  content: {
    paddingBottom: 20,
  },
}));

interface Props {
  className?: string;
  editorId: string;
  editorHeaderId: string;
  draggable?: boolean;
  action: string;
  topicTab?: RCNode.CNodeTopicTab;
  fullScreen: boolean;
  disabled: boolean;
  onPreview: () => void;
  onSetTopicTab: (tab: RCNode.CNodeTopicTab) => void;
  onFullScreen: () => void;
}

const Header = ({
  className,
  editorId,
  editorHeaderId,
  draggable,
  action,
  topicTab,
  fullScreen,
  disabled,
  onSetTopicTab,
  onPreview,
  onFullScreen,
}: Props) => {
  const classes = useStyles();
  const { uname, avatar } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElType, setAnchorElType] = React.useState<null | HTMLElement>(null);

  const handleCloseTopicTab = () => {
    setAnchorElType(null);
  };

  const handleOpenTopicTab = () => {
    if (!disabled) {
      setAnchorElType(document.getElementById(editorId));
    }
  };

  const handleChangeTopicTab = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    onSetTopicTab(value as RCNode.CNodeTopicTab);
    handleCloseTopicTab();
  };

  const handleOpenActions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handlePreview = () => {
    handleCloseActions();
    onPreview();
  };

  const handleFullScreen = () => {
    handleCloseActions();
    onFullScreen();
  };

  return (
    <React.Fragment>
      <div
        id={editorHeaderId}
        className={clsx('flex editor-header', className, {
          [classes.dragEnabled]: draggable && !fullScreen,
        })}
      >
        <Avatar className="avatar" name={uname} image={avatar} />
        <div className="flex box">
          <Typography className="flex editor-uname">
            {uname || '~unknown~'}
            <ArrowRightIcon color="inherit" />
          </Typography>
          {/(create)|(update)/.test(action) && (
            <Typography className="flex editor-tpoic-type">
              <Typography
                className={clsx('flex', classes.color, {
                  disabled: disabled,
                })}
                component="span"
                onClick={handleOpenTopicTab}
              >
                {topicTab ? navTabs[topicTab].name : '请选择分类'}
                <TabIcon tab={topicTab} />
              </Typography>
            </Typography>
          )}
        </div>
        <div className="editor-header-actions">
          <IconButton size="large" onClick={handleOpenActions}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorPosition={{ top: 30, left: 30 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleCloseActions}
      >
        <List>
          <ListItem button onClick={handlePreview}>
            <ListItemIcon>
              <PreviewIcon color="inherit" />
            </ListItemIcon>
            <ListItemText className={classes.text} primary="预览" />
          </ListItem>
          <Hidden smDown>
            <ListItem button onClick={handleFullScreen}>
              <ListItemIcon>
                {fullScreen ? (
                  <FullscreenExitIcon color="inherit" />
                ) : (
                  <FullscreenIcon color="inherit" />
                )}
              </ListItemIcon>
              <ListItemText className={classes.text} primary="全屏" />
            </ListItem>
          </Hidden>
        </List>
      </Popover>

      <Popover
        open={Boolean(anchorElType)}
        anchorEl={anchorElType}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={handleCloseTopicTab}
      >
        <DialogTitle className={classes.title}>
          <IconButton className={classes.back} size="large" onClick={handleCloseTopicTab}>
            <ArrowBackIcon />
          </IconButton>
          请选择一个分类
        </DialogTitle>
        <DialogContent className={classes.content}>
          <FormControl>
            <RadioGroup name="topicType" value={topicTab} onChange={handleChangeTopicTab}>
              {topicTabs.map((tab) => (
                <FormControlLabel
                  key={tab}
                  value={tab}
                  label={navTabs[tab].name}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
      </Popover>
    </React.Fragment>
  );
};

export default Header;
