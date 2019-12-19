import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateUUID } from '../../common';
import { post } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { AppWrapper } from '../../Layout';
import Notification from '../../Components/Notification';
import SigninSvg from '../../static/google_signin.svg';
import LogoSvg from '../../static/cnodejs/cnodejs.svg';
import './signin.styl';

const useStyles = makeStyles(theme => ({
  svg: theme.palette.type === 'light' ? {} : {
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
          borderBottomColor: theme.palette.type === 'light' ? 'rgba(128,189,1,.87)' : 'rgba(108,168,3,.87)',
        },
        '&:before': {
          borderBottomColor: theme.palette.type === 'light' ? '#56b700' : '#519217',
        },
        '&:after': {
          borderBottomColor: theme.palette.type === 'light' ? '#80bd01' : '#519217',
        },
      },
    },
    '&.error': {
      '& label': {
        color: theme.palette.type === 'light' ? '#f44336' : '#b92c22',
      },
      '& .MuiInput-underline': {
        '&:after': {
          borderBottomColor: theme.palette.type === 'light' ? '#f44336' : '#b92c22',
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
  const history = useHistory();
  const dispatch = useDispatch();
  const isCancel = React.useRef();
  const { isAuthed, ...authRest } = useSelector(state => state.auth);

  const [state, setState] = React.useState({
    status: isAuthed ? 'success' : 'idle',
    focus: isAuthed === false,
    isUUID: isAuthed === true,
    diff: isAuthed === false,
    ...authRest,
    isAuthed,
  });

  const handleChange = name => event => {
    const value = event.target.value.trim();
    const { accesstoken } = authRest;
    const condition = value === accesstoken;

    setState(prevState => ({
      ...prevState,
      status: condition ? 'success' : 'idle',
      [name]: value,
      isUUID: validateUUID(value),
      diff: condition === false,
    }));
  };

  const handleOnFocus = () => {
    setState(prevState => ({ ...prevState, focus: true }));
  };

  const handleOnBlur = () => {
    setState(prevState => ({ ...prevState, focus: false }));
  };

  const handleClick = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push('/');
    }
  };

  const validateUser = async () => {
    const { accesstoken } = state;
    const params = {
      url: '/accesstoken',
      params: { accesstoken },
    };

    const { success, data, err_msg } = await post(params);

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

      dispatch({ type: 'UPDATE_AUTH', data: auth });

      setState(prevState => ({
        ...prevState,
        status: 'success',
        diff: false,
        ...auth,
      }));
    } else {
      setState(prevState => ({ ...prevState, status: 'error' }));

      if (err_msg) {
        dispatch({
          type: 'OPEN_NOTIFICATION',
          data: {
            message: err_msg,
            status: 'error',
          },
        });
      }
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const { isUUID, diff } = state;

    if (isUUID && diff) {
      isCancel.current = false;

      validateUser();
    }
  };

  React.useEffect(() => {
    return () => isCancel.current = true;
  }, []);

  return (
    <AppWrapper
      title="登录"
      withHeader={false}
      htmlAttributes={{ id: 'signin' }}
    >
      <div className="container flex">
        <SigninSvg className={`${classes.svg} bg`} />

        <div className="flex area top" />
        <div className="flex area mid">
          <div className="logo">
            <LogoSvg />
          </div>

          <Collapse in={state.isAuthed}>
            {state.isAuthed &&
              <div className={clsx('auth-user', {
                'show': state.isAuthed,
                'diff': state.diff,
              })}>
                <div className="avatar">
                  <Avatar className="item" alt={state.uname} src={state.avatar} />
                </div>
                <Typography className="name">
                  <span className="item">{state.uname}</span>
                </Typography>
              </div>
            }
          </Collapse>

          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              id="accesstoken"
              label="Access Token"
              margin="normal"
              spellCheck="false"
              autoFocus={!state.isAuthed}
              error={state.status === 'error'}
              className={clsx(classes.root, state.status, {
                'focus': state.focus,
              })}
              onChange={handleChange('accesstoken')}
              value={state.accesstoken || ''}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
            />
            <div className="btn">
              <Button
                variant="outlined"
                {
                  ...
                  state.diff
                  ? {
                    type: 'submit',
                    disabled: !state.isUUID,
                  } : {
                    onClick: handleClick,
                    autoFocus: state.isAuthed,
                  }
                }
              >
                {state.diff ? '授权' : '完成'}
              </Button>
            </div>
          </form>
        </div>
        <div className="flex area bot" />
      </div>

      <Notification />
    </AppWrapper>
  );
};

export default Signin;
