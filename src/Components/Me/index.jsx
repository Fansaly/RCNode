import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteAuth } from '../../store/actions';

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

class Me extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  tmier = null;

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

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.props.deleteAuth();
    }, 330);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { open } = this.state;
    const { isAuthed, avatar } = this.props;

    return (
      <Grid item className="flex">
        <Grid
          container
          spacing={0}
          alignContent={'center'}
          alignItems={'center'}
          justify={'center'}
          className={isAuthed ? 'info' : 'signin'}
        >
          <IconButton
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className="me"
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
                            <Badge badgeContent={3} color={'default'} className="badge">
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

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

const mapDispatchToProps = dispatch => ({
  deleteAuth: () => {
    dispatch(deleteAuth());
  },
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Me);
