import './signin.styl';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { signin } from '@/api';
import SigninSvg from '@/assets/google_signin.svg?react';
import Logo from '@/components/Logo';
import Notification from '@/components/Notification';
import { AppFrame } from '@/layout';
import { useRoutes } from '@/router';
import { useDispatch, useSelector } from '@/store';
import { uuidValidate } from '@/utils';

const useStyles = makeStyles((theme) => ({
  svg:
    theme.palette.mode === 'light'
      ? {}
      : {
          '& #cell-1': { fill: '#0d0d0c' },
          '& #cell-2': { fill: '#141413' },
          '& #cell-3': { fill: '#181817' },
          '& #cell-4': { fill: '#1c1d1c' },
          '& #cell-5': { fill: '#222322' },
          '& #cell-6': { fill: '#232423' },
          '& #cell-7': { fill: '#272727' },
        },
  root: {
    '&.success': {
      '& label': {
        color: '#508028',
      },
      '& .MuiInput-underline': {
        '&:hover:before': {
          borderBottomColor:
            theme.palette.mode === 'light'
              ? 'rgba(128,189,1,.87)'
              : 'rgba(108,168,3,.87)',
        },
        '&:before': {
          borderBottomColor: theme.palette.mode === 'light' ? '#56b700' : '#519217',
        },
        '&:after': {
          borderBottomColor: theme.palette.mode === 'light' ? '#80bd01' : '#519217',
        },
      },
    },
    '&.error': {
      '& label': {
        color: theme.palette.mode === 'light' ? '#f44336' : '#b92c22',
      },
      '& .MuiInput-underline': {
        '&:after': {
          borderBottomColor: theme.palette.mode === 'light' ? '#f44336' : '#b92c22',
        },
      },
    },
    '&.focus': {
      '& label': {
        color: '#46483e',
      },
      '& .MuiInput-underline': {
        '&:after': {
          borderBottomColor: '#46483e',
        },
      },
    },
    '& .MuiInput-underline': {
      '&:hover:before': {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(70,72,69,.8)',
      },
      '&:after': {
        borderBottomColor: 'rgba(70,72,69,.8)',
      },
    },
  },
}));

const Signin = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useRoutes();

  const { isAuthed, ...authRest } = useSelector((state) => state.auth);

  const isCancel = React.useRef<boolean>(false);
  const [state, setState] = React.useState<
    RCNode.AuthState & {
      isUUID: boolean;
      diff: boolean;
      focus: boolean;
      status: 'idle' | 'success' | 'error';
    }
  >({
    ...authRest,
    isAuthed,
    isUUID: isAuthed === true,
    diff: isAuthed === false,
    focus: isAuthed === false,
    status: isAuthed ? 'success' : 'idle',
  });
  const [notification, setNotification] = React.useState<RCNode.Notification>({
    open: false,
    status: 'success',
    message: '',
  });

  const handleOnFocus = () => {
    setState((prevState) => ({ ...prevState, focus: true }));
  };

  const handleOnBlur = () => {
    setState((prevState) => ({ ...prevState, focus: false }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value.trim();
    const condition = value === authRest.accesstoken;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
      isUUID: uuidValidate(value),
      diff: condition === false,
      status: condition ? 'success' : 'idle',
    }));
  };

  const validateUser = async () => {
    isCancel.current = false;
    const { accesstoken } = state;

    const { success, err_msg, ...data } = await signin({
      accesstoken: accesstoken as string,
    });

    if (isCancel.current) {
      return;
    }

    if (success) {
      const auth = {
        isAuthed: true,
        accesstoken,
        avatar: data.avatar_url,
        uname: data.loginname,
        uid: data.id,
      };

      dispatch({ type: 'auth/update', payload: auth });

      setState((prevState) => ({
        ...prevState,
        ...auth,
        diff: false,
        status: 'success',
      }));
    } else {
      setState((prevState) => ({ ...prevState, status: 'error' }));

      if (err_msg) {
        setNotification((prevState) => ({
          ...prevState,
          open: true,
          status: 'error',
          message: err_msg,
        }));
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state.isUUID && state.diff) {
      validateUser();
    }
  };

  const handleClick = () => {
    let from = '/';
    const state = location.state as any;

    const pathname = state?.from?.pathname || '';
    const search = state?.from?.search || '';
    const hash = state?.from?.hash || '';

    from = `${pathname}${search}${hash}` || from;
    from = from.replace(/\s/g, '');

    navigate(from, { replace: true });
  };

  React.useEffect(() => {
    return () => {
      isCancel.current = true;
    };
  }, []);

  return (
    <AppFrame withHeader={false} htmlAttributes={{ id: 'signin' }}>
      <div className="container flex">
        <SigninSvg className={`${classes.svg} bg`} />

        <div className="flex area top" />
        <div className="flex area mid">
          <div className="logo">
            <Logo color="dark" />
          </div>

          <Collapse in={state.isAuthed}>
            {state.isAuthed && (
              <div
                className={clsx('auth-user', {
                  show: state.isAuthed,
                  diff: state.diff,
                })}
              >
                <div className="avatar">
                  <Avatar className="item" alt={state.uname} src={state.avatar} />
                </div>
                <Typography className="name">
                  <span className="item">{state.uname}</span>
                </Typography>
              </div>
            )}
          </Collapse>

          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              id="accesstoken"
              className={clsx(classes.root, state.status, {
                focus: state.focus,
              })}
              margin="normal"
              variant="standard"
              fullWidth
              label="Access Token"
              name="accesstoken"
              value={state.accesstoken || ''}
              error={state.status === 'error'}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={!state.isAuthed}
              spellCheck="false"
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              onChange={handleChange}
            />
            <div className="btn">
              <Button
                color="inherit"
                variant="outlined"
                disableFocusRipple
                {...(state.diff
                  ? {
                      type: 'submit',
                      disabled: !state.isUUID,
                    }
                  : {
                      autoFocus: state.isAuthed,
                      disabled: status !== 'success',
                      onClick: handleClick,
                    })}
              >
                {state.diff ? '授权' : '完成'}
              </Button>
            </div>
          </form>
        </div>
        <div className="flex area bot" />
      </div>

      <Notification
        {...notification}
        onClose={() => {
          setNotification((prevState) => ({ ...prevState, open: false }));
        }}
      />
    </AppFrame>
  );
};

export default Signin;
