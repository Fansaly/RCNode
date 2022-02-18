import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { get } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
  badge: {
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: 6,
      marginRight: 6,
      width: 6,
      height: 6,
      borderRadius: '50%',
      opacity: 0,
      transition: 'opacity .3s linear',
    },
    '&.has-message:before': {
      opacity: 1,
      backgroundColor: 'rgba(128, 189, 1, .85)',
      boxShadow: '0 0 4px rgba(0, 0, 0, .15)',
    },
    '&.has-message:after': {
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid #44b700',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
  hidden: {
    '& span': {
      visibility: 'hidden',
    },
  },
}));

const Me = () => {
  const { isAuthed, accesstoken, uname, avatar } = useSelector(({ auth }) => auth);
  const { time } = useSelector(({ settings }) => settings);
  const message = useSelector(s => s.message);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const timerMessage = React.useRef(null);
  const timerSignout = React.useRef(null);
  const isCancel = React.useRef();
  const anchorEl = React.useRef(null);

  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(prevState => !prevState);
  };

  const handleClose = event => {
    if (anchorEl.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleInfo = event => {
    handleClose(event);
    history.push(`/user/${uname}`);
  };

  const handleMessage = event => {
    const messagePath = '/message';
    const { pathname } = history.location;

    handleClose(event);

    if (pathname === messagePath) {
      history.replace(messagePath);
    } else {
      history.push(messagePath);
    }
  };

  const handleSettings = event => {
    handleClose(event);
    history.push('/settings');
  };

  const handleSignin = event => {
    handleClose(event);
    history.push('/signin');
  };

  const handleSignout = event => {
    handleClose(event);

    clearTimeout(timerSignout.current);

    timerSignout.current = setTimeout(() => {
      dispatch({ type: 'DELETE_AUTH' });
      dispatch({ type: 'CLEAN_MESSAGE' });
    }, 330);
  };

  React.useEffect(() => {
    return () => clearTimeout(timerSignout.current);
  }, []);

  React.useEffect(() => {
    isCancel.current = false;

    clearTimeout(timerMessage.current);

    const fetchUnreadCount = async () => {
      if (!isAuthed) { return; }

      const params = {
        url: '/message/count',
        params: { accesstoken },
      };

      const { success, data: count } = await get(params);

      if (isCancel.current) {
        return;
      }

      if (success) {
        dispatch({ type: 'UPDATE_MESSAGE', data: count });
      }

      if (time > 0) {
        timerMessage.current = setTimeout(() => {
          fetchUnreadCount();
        }, time * 1e3);
      }
    };

    fetchUnreadCount();

    return () => {
      isCancel.current = true;
      clearTimeout(timerMessage.current);
    };
  }, [isAuthed, accesstoken, dispatch, time]);

  return (
    <Grid item className="flex">
      <Grid
        container
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        className={isAuthed ? 'info' : 'signin'}
      >
        <IconButton
          ref={node => {
            anchorEl.current = node;
          }}
          aria-owns={open ? 'menu-list-grow' : null}
          aria-haspopup="true"
          onClick={handleToggle}
          className={clsx('me', classes.badge, {
            'has-message': Boolean(message.count),
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
        <Popper open={open} anchorEl={anchorEl.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    {isAuthed &&
                      <MenuItem onClick={handleInfo}>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="资料" />
                      </MenuItem>
                    }
                    {isAuthed &&
                      <MenuItem onClick={handleMessage}>
                        <ListItemIcon>
                          <Badge
                            badgeContent={message.count}
                            className={clsx('badge', {
                              [classes.hidden]: message.count <= 0,
                            })}
                          >
                            <NotificationsIcon />
                          </Badge>
                        </ListItemIcon>
                        <ListItemText primary="消息" />
                      </MenuItem>
                    }
                    <MenuItem onClick={handleSettings}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="设置" />
                    </MenuItem>
                    {isAuthed ? (
                      <MenuItem onClick={handleSignout}>
                        <ListItemIcon>
                          {SignOutIcon}
                        </ListItemIcon>
                        <ListItemText primary="退出" />
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={handleSignin}>
                        <ListItemIcon>
                          <SignInIcon />
                        </ListItemIcon>
                        <ListItemText primary="登录" />
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
};

export default Me;
