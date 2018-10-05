import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  updateAuth,
  openNotification,
} from '../../store/actions';
import { validateUUID } from '../../common';
import { post as validateUser } from '../../api';

import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Notification from '../../Components/Notification';
import SigninSvg from '../../static/google_signin.svg';
import LogoSvg from '../../static/cnodejs/cnodejs.svg';
import './signin.styl';

class Signin extends React.Component {
  constructor(props) {
    super(props);

    const { isAuthed, ...other } = props;

    this.state = {
      status: isAuthed ? 'success' : 'idle',
      focus: isAuthed === false,
      isUUID: isAuthed === true,
      diff: isAuthed === false,
      isAuthed,
      ...other,
    };
  }

  handleChange = name => event => {
    const value = event.target.value.trim();
    const { accesstoken } = this.props;
    const condition = value === accesstoken;

    this.setState({
      status: condition ? 'success' : 'idle',
      [name]: value,
      isUUID: validateUUID(value),
      diff: condition === false,
    });
  };

  handleOnFocus = () => {
    this.setState({ focus: true });
  };

  handleOnBlur = () => {
    this.setState({ focus: false });
  };

  handleClick = () => {
    this.props.history.goBack();
  };

  validateUser = async () => {
    const { accesstoken } = this.state;
    const params = {
      url: '/accesstoken',
      params: { accesstoken },
    };

    const { status, data, msg } = await validateUser(params);

    if (status) {
      const {
        id: uid,
        loginname: uname,
        avatar_url: avatar,
      } = data;

      const auth = {
        isAuthed: true,
        accesstoken,
        avatar,
        uname,
        uid,
      };

      this.props.updateAuth(auth);

      this.setState({
        status: 'success',
        diff: false,
        ...auth,
      });
    } else {
      this.setState({ status: 'error' });
      msg && this.props.openNotification({
        message: msg,
        status: 'error',
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { isUUID, diff } = this.state;

    isUUID && diff && this.validateUser();
  };

  render() {
    const {
      status,
      isUUID,
      diff,
      accesstoken,
      isAuthed,
      avatar,
      uname,
    } = this.state;

    return (
      <React.Fragment>
        <Helmet
          title="Signin"
          htmlAttributes={{ id: 'signin' }}
        />

        <div className="container flex">
          <SigninSvg className="bg" />

          <div className="flex area top" />
          <div className="flex area mid">
            <div className="logo">
              <LogoSvg />
            </div>

            <Collapse in={isAuthed}>
              {isAuthed &&
                <div className={classNames('auth-user', {
                  'show': isAuthed,
                })}>
                  <Avatar alt={uname} src={avatar} className="avatar" />
                  <span className="name">{uname}</span>
                </div>
              }
            </Collapse>

            <form
              className={classNames({
                'error': status === 'error',
              })}
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
            >
              <TextField
                fullWidth
                id="accesstoken"
                label="Access Token"
                margin="normal"
                spellCheck="false"
                autoFocus={!isAuthed}
                error={status === 'error'}
                className={classNames(this.state.status, {
                  'focus': this.state.focus,
                })}
                onChange={this.handleChange('accesstoken')}
                value={accesstoken || ''}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnBlur}
              />
              <div className="submit">
                {diff ? (
                  <Button
                    disabled={!isUUID}
                    variant="outlined"
                    type="submit"
                  >
                    授权
                  </Button>
                ) : (
                  <Button variant="outlined"
                    onClick={this.handleClick}
                    autoFocus={isAuthed}
                  >
                    完成
                  </Button>
                )}
              </div>
            </form>
          </div>
          <div className="flex area bot" />
        </div>

        <Notification />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

const mapDispatchToProps = dispatch => ({
  updateAuth: auth => {
    dispatch(updateAuth(auth));
  },
  openNotification: message => {
    dispatch(openNotification(message));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signin);
