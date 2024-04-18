import './me.styl';

import SignInIcon from '@mui/icons-material/Login';
import SignOutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchUnreadMessageCount } from '@/api';
import AvatarSvg from '@/assets/avatar.svg?react';
import { useDispatch, useSelector } from '@/store';

const useStyles = makeStyles(() => ({
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
  menuList: {
    '& .MuiListItemIcon-root': {
      minWidth: 48,
    },
  },
}));

const Me = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthed, accesstoken, uname, avatar } = useSelector((state) => state.auth);
  const { time } = useSelector((state) => state.settings);
  const message = useSelector((state) => state.message);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const timerMessage = React.useRef<ReturnType<typeof setTimeout>>();
  const timerSignout = React.useRef<ReturnType<typeof setTimeout>>();
  const isCancel = React.useRef<boolean>();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGotoInfo = () => {
    handleClose();
    navigate(`/user/${uname}`);
  };

  const handleGotoMessage = () => {
    handleClose();
    navigate('/message');
  };

  const handleGotoSettings = () => {
    handleClose();
    navigate('/settings');
  };

  const handleGotoSignin = () => {
    handleClose();
    navigate('/signin');
  };

  const handleSignout = () => {
    handleClose();

    clearTimeout(timerSignout.current);

    timerSignout.current = setTimeout(() => {
      dispatch({ type: 'message/clean' });
      dispatch({ type: 'auth/clean' });
    }, 330);
  };

  React.useEffect(() => {
    isCancel.current = false;
    const controller = new AbortController();

    clearTimeout(timerMessage.current);

    const fetchUnreadCount = async () => {
      if (!isAuthed) {
        return;
      }

      const { success, data: count } = await fetchUnreadMessageCount({
        signal: controller.signal,
        accesstoken,
      });

      if (isCancel.current) {
        return;
      }

      if (success) {
        dispatch({ type: 'message/update', payload: { count } });
      }

      if (time > 0) {
        timerMessage.current = setTimeout(() => {
          fetchUnreadCount();
        }, time * 1e3);
      }
    };

    fetchUnreadCount();

    return () => {
      clearTimeout(timerMessage.current);
      isCancel.current = true;
      controller.abort();
    };
  }, [isAuthed, accesstoken, time, dispatch]);

  React.useEffect(() => {
    return () => clearTimeout(timerSignout.current);
  }, []);

  return (
    <Grid className="flex" item>
      <Grid
        className={isAuthed ? 'info' : 'signin'}
        container
        alignContent="center"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          className={clsx('me', classes.badge, {
            'has-message': Boolean(message.count),
          })}
          size="large"
          onClick={handleOpen}
        >
          <Avatar className="flex avatar">
            {isAuthed ? <img src={avatar} alt="U" /> : <AvatarSvg />}
          </Avatar>
        </IconButton>
        <Menu
          classes={{ list: classes.menuList }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          keepMounted
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={handleClose}
        >
          {isAuthed && (
            <MenuItem onClick={handleGotoInfo}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="资料" />
            </MenuItem>
          )}
          {isAuthed && (
            <MenuItem onClick={handleGotoMessage}>
              <ListItemIcon>
                <Badge
                  className={clsx('badge', {
                    [classes.hidden]: message.count <= 0,
                  })}
                  badgeContent={message.count}
                >
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="消息" />
            </MenuItem>
          )}
          <MenuItem onClick={handleGotoSettings}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="设置" />
          </MenuItem>
          {isAuthed ? (
            <MenuItem onClick={handleSignout}>
              <ListItemIcon>
                <SignOutIcon />
              </ListItemIcon>
              <ListItemText primary="退出" />
            </MenuItem>
          ) : (
            <MenuItem onClick={handleGotoSignin}>
              <ListItemIcon>
                <SignInIcon />
              </ListItemIcon>
              <ListItemText primary="登录" />
            </MenuItem>
          )}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Me;
