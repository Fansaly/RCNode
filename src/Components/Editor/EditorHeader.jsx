import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  navTabsObject as navTabs,
  topicTypes,
  matchTab,
} from '../../common';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';

import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import PreviewIcon from '@material-ui/icons/LocalLibrary';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Avatar from '../../Components/Avatar';
import TopicTypeIcon from '../../Components/TopicTypeIcon';
import './editor-header.styl';

const useStyles = makeStyles(theme => ({
  color: {
    color: theme.palette.type === 'light' ? '#0366d6' : '#1858a0',
    '& svg': {
      color: theme.palette.type === 'light' ? 'rgba(0,0,0,.58)' : 'rgba(230,230,230,.58)',
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

const EditorHeader = (props) => {
  const {
    disabled,
    onPublishTab,
    onPreview,
    fullScreen,
    onFullScreen,
  } = props;

  const { isAuthed, uname, avatar } = useSelector(({ auth }) => auth);
  const { tab, action } = useSelector(({ editor }) => editor);
  const location = useLocation();
  const classes = useStyles();

  const [moreOpen, setMoreOpen] = React.useState(false);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [publishTab, setPublishTab] = React.useState(null);
  const anchorEl = React.useRef(null);

  const handlePublishTab = React.useCallback(() => {
    onPublishTab(publishTab);
  }, [onPublishTab, publishTab]);

  const handleCloseSelect = React.useCallback(() => {
    handlePublishTab();
    setSelectOpen(false);
  }, [handlePublishTab]);

  const handleOpenSelect = () => {
    setSelectOpen(!disabled);
  };

  const handleChange = (event, value) => {
    setPublishTab(value);
  };

  const handleCloseMore = () => {
    setMoreOpen(false);
  };

  const handleOpenMore = () => {
    setMoreOpen(true);
  };

  const handlePreview = () => {
    handleCloseMore();
    onPreview();
  };

  const handleFullScreen = () => {
    handleCloseMore();
    onFullScreen();
  };

  React.useEffect(() => {
    const getPublishTab = () => {
      const _tab = matchTab(location);

      return (
        _tab === null
          ? null
          : topicTypes.includes(_tab)
            ? _tab
            : ''
      );
    };

    setPublishTab(tab || getPublishTab());
  }, [location, tab]);

  React.useEffect(() => {
    handleCloseSelect();
  }, [handleCloseSelect]);

  return (isAuthed &&
    <React.Fragment>
      <div className="flex editor-header">
        <Avatar
          name={uname}
          image={avatar}
          className="avatar"
        />
        <div className="flex box">
          <Typography className="flex editor-uname">
            {uname}
            <ArrowRightIcon color="inherit" />
          </Typography>
          {/(create)|(update)/.test(action) &&
            <Typography className="flex editor-tpoic-type">
              <Typography
                className={clsx('flex', classes.color, {
                  'disabled': disabled,
                })}
                onClick={handleOpenSelect}
                component="span"
              >
                {publishTab ? navTabs[publishTab].name : '请选择分类'}
                <TopicTypeIcon tab={publishTab} />
              </Typography>
            </Typography>
          }
        </div>
        <div className="editor-header-actions">
          <IconButton
            buttonRef={node => {
              anchorEl.current = node;
            }}
            variant="contained"
            onClick={handleOpenMore}
          >
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <Popover
        open={moreOpen}
        anchorEl={anchorEl.current}
        anchorReference="anchorEl"
        anchorPosition={{ top: 30, left: 30 }}
        onClose={handleCloseMore}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          <ListItem button onClick={handlePreview}>
            <ListItemIcon>
              <PreviewIcon color="inherit" />
            </ListItemIcon>
            <ListItemText
              className={classes.text}
              primary="预览"
            />
          </ListItem>
          <Hidden xsDown>
            <ListItem button onClick={handleFullScreen}>
              <ListItemIcon>
                {fullScreen ? (
                  <FullscreenExitIcon color="inherit" />
                ) : (
                  <FullscreenIcon color="inherit" />
                )}
              </ListItemIcon>
              <ListItemText
                className={classes.text}
                primary="全屏"
              />
            </ListItem>
          </Hidden>
        </List>
      </Popover>

      <Dialog
        open={selectOpen}
        maxWidth="xs"
        onClose={handleCloseSelect}
      >
        <DialogTitle className={classes.title}>
          <IconButton
            className={classes.back}
            onClick={handleCloseSelect}
          >
            <ArrowBackIcon />
          </IconButton>
          请选择一个分类
        </DialogTitle>
        <DialogContent className={classes.content}>
          <RadioGroup
            aria-label="topicType"
            name="topicType"
            value={publishTab}
            onChange={handleChange}
          >
            {topicTypes.map(_tab => (
              <FormControlLabel
                key={_tab}
                value={_tab}
                label={navTabs[_tab].name}
                control={<Radio />}
              />
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

EditorHeader.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onPublishTab: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  onFullScreen: PropTypes.func.isRequired,
};

export default EditorHeader;
