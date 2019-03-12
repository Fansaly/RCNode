import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteAuth } from '../../store/actions';
import { get as getData } from '../../fetch';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import SignInIcon from '@material-ui/icons/ExitToApp';
import { SignOutIcon } from '../../Components/Icons';

import AvatarSvg from '../../static/avatar.svg';
import './me.styl';

const styles = theme => ({
  hidden: {
    '& span': {
      visibility: 'hidden',
    },
  },
});

class Me extends React.Component {
  constructor(props) {
    super(props);

    const { time } = this.props;

    this.state = {
      open: false,
      count: 0,
      time,
    };
  }

  timerMessage = null;
  timerSignout = null;

  handleToggle = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  fetchUnreadCount = async () => {
    const { isAuthed, accesstoken } = this.props;
    const { time } = this.state;

    if (!isAuthed) { return; }

    const params = {
      url: '/message/count',
      params: { accesstoken },
    };

    const { success, data } = await getData(params);

    success && this.setState({ count: data });

    if (time > 0) {
      this.timerMessage = setTimeout(() => {
        this.fetchUnreadCount();
      }, time * 1e3);
    }
  };

  handleInfo = event => {
    const { history, uname } = this.props;

    this.handleClose(event);

    history.push(`/user/${uname}`);
  };

  handleMessage = event => {
    const messagePath = '/message';
    const { history } = this.props;
    const { pathname } = history.location;

    this.handleClose(event);

    if (pathname === messagePath) {
      history.replace(messagePath);
    } else {
      history.push(messagePath);
    }
  };

  handleSettings = event => {
    const { history } = this.props;

    this.handleClose(event);

    history.push('/settings');
  };

  handleSignin = event => {
    const { history } = this.props;

    this.handleClose(event);

    history.push('/signin');
  };

  handleSignout = event => {
    this.handleClose(event);

    clearTimeout(this.timerSignout);

    this.timerSignout = setTimeout(() => {
      this.props.deleteAuth();
      this.setState({
        count: 0,
      });
    }, 330);
  };

  componentDidMount() {
    this.fetchUnreadCount();
  }

  componentWillReceiveProps(nextProps) {
    const { time } = nextProps;
    clearTimeout(this.timerMessage);
    if (time > 0) {
      this.setState({
        time,
      }, () => {
        this.fetchUnreadCount();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerMessage);
    clearTimeout(this.timerSignout);
  }

  render() {
    const { classes, isAuthed, avatar } = this.props;
    const { open, count } = this.state;

    return (
      <Grid item className="flex">
        <Grid
          container
          alignContent="center"
          alignItems="center"
          justify="center"
          className={isAuthed ? 'info' : 'signin'}
        >
          <IconButton
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className={classNames('me', {
              'has-message': Boolean(count),
            })}
          >
            <Avatar className="flex avatar">
              {isAuthed ? (
                <img src={avatar} alt="U" />
              ) : (
                <AvatarSvg />
              )}
            </Avatar>
          </IconButton>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {isAuthed &&
                        <MenuItem onClick={this.handleInfo}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText inset primary="资料" />
                        </MenuItem>
                      }
                      {isAuthed &&
                        <MenuItem onClick={this.handleMessage}>
                          <ListItemIcon>
                            <Badge
                              badgeContent={count}
                              className={classNames('badge', {
                                [classes.hidden]: count <= 0,
                              })}
                            >
                              <NotificationsIcon />
                            </Badge>
                          </ListItemIcon>
                          <ListItemText inset primary="消息" />
                        </MenuItem>
                      }
                      <MenuItem onClick={this.handleSettings}>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="设置" />
                      </MenuItem>
                      {isAuthed ? (
                        <MenuItem onClick={this.handleSignout}>
                          <ListItemIcon>
                            {SignOutIcon}
                          </ListItemIcon>
                          <ListItemText inset primary="退出" />
                        </MenuItem>
                      ) : (
                        <MenuItem onClick={this.handleSignin}>
                          <ListItemIcon>
                            <SignInIcon />
                          </ListItemIcon>
                          <ListItemText inset primary="登录" />
                        </MenuItem>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    );
  }
}

Me.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, settings }) => ({
  ...auth,
  time: settings.time,
});

const mapDispatchToProps = dispatch => ({
  deleteAuth: () => {
    dispatch(deleteAuth());
  },
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Me);
