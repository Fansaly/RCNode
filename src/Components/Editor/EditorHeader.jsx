import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  navTabsObject as navTabs,
  topicTypes,
  matchTab,
} from '../../common';

import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
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
});

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moreOpen: false,
      selectOpen: false,
      publishTab: null,
    };
  }

  getPublishTab = () => {
    const tab = matchTab(this.props.location);

    return (
      tab === null
        ? null
        : topicTypes.includes(tab)
          ? tab
          : ''
    );
  };

  handleChange = (event, value) => {
    this.setState({
      publishTab: value,
    }, () => {
      this.handleCloseSelect(value);
    });
  };

  handleOpenSelect = () => {
    const { disabled } = this.props;
    this.setState({
      selectOpen: !disabled,
    });
  };

  handleCloseSelect = () => {
    this.handlePublishTab();
    this.setState({
      selectOpen: false,
    });
  };

  handlePublishTab = () => {
    const { publishTab } = this.state;
    this.props.onPublishTab(publishTab);
  };

  handleCloseMore = () => {
    this.setState({
      moreOpen: false,
    });
  };

  handleOpenMore = () => {
    this.setState({
      moreOpen: true,
    });
  };

  handlePreview = () => {
    this.handleCloseMore();
    this.props.onPreview();
  };

  handleFullScreen = () => {
    this.handleCloseMore();
    this.props.onFullScreen();
  };

  componentWillMount() {
    const { tab } = this.props;
    const publishTab = tab || this.getPublishTab();

    this.setState({
      publishTab,
    }, () => {
      this.handlePublishTab();
    });
  }

  render() {
    const {
      classes,
      disabled,
      uname,
      avatar,
      action,
      isAuthed,
      fullScreen,
    } = this.props;

    const {
      moreOpen,
      selectOpen,
      publishTab,
    } = this.state;

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
                  className={classNames('flex', {
                    'disabled': disabled,
                  })}
                  onClick={this.handleOpenSelect}
                  component="span"
                >
                  {publishTab ? navTabs[publishTab].name : '请选择分类'}
                  <TopicTypeIcon tab={publishTab} color="inherit" />
                </Typography>
              </Typography>
            }
          </div>
          <div className="editor-header-actions">
            <IconButton
              buttonRef={node => {
                this.anchorEl = node;
              }}
              variant="contained"
              onClick={this.handleOpenMore}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>

        <Popover
          open={moreOpen}
          anchorEl={this.anchorEl}
          anchorReference="anchorEl"
          anchorPosition={{ top: 200, left: 400 }}
          onClose={this.handleCloseMore}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List component="nav">
            <ListItem button onClick={this.handlePreview}>
              <ListItemIcon>
                <PreviewIcon color="inherit" />
              </ListItemIcon>
              <ListItemText
                className={classes.text}
                primary="预览"
              />
            </ListItem>
            <Hidden xsDown>
              <ListItem button onClick={this.handleFullScreen}>
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
          onEntering={this.handleEntering}
          onClose={this.handleCloseSelect}
        >
          <DialogTitle className={classes.title}>
            <IconButton
              className={classes.back}
              onClick={this.handleCloseSelect}
            >
              <ArrowBackIcon />
            </IconButton>
            请选择一个分类
          </DialogTitle>
          <DialogContent className={classes.content}>
            <RadioGroup
              ref={ref => {
                this.radioGroupRef = ref;
              }}
              aria-label="topicType"
              name="topicType"
              value={publishTab}
              onChange={this.handleChange}
            >
              {topicTypes.map(tab => (
                <FormControlLabel
                  key={tab}
                  value={tab}
                  label={navTabs[tab].name}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

Editor.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, editor }) => ({
  ...auth,
  ...editor,
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
  ),
)(Editor);
