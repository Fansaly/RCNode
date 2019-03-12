import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  readAllMessage,
  updateMessage,
} from '../../store/actions';
import {
  get as getData,
  post,
} from '../../fetch';

import { withStyles } from '@material-ui/core/styles';

import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MarkAllIcon from '@material-ui/icons/DoneAll';

import Layout from '../../Layout';
import MessageCard from './MessageCard';
import Progress from '../../Components/Progress';

const styles = theme => ({
  spacings: {
    marginTop: 40,
    marginBottom: 10,
    padding: '0 7px',
    '@media (max-width: 768px)': {
      marginTop: 30,
      marginBottom: 8,
    },
    '@media (max-width: 600px)': {
      marginTop: 20,
      marginBottom: 4,
    },
  },
  text: {
    position: 'relative',
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    color: 'rgba(0,0,0,.6)',
    pointerEvents: 'none',
    transition: 'opacity .15s cubic-bezier(.4,0,.2,1)',
    '@media (max-width: 600px)': {
      marginRight: 4,
    },
    '& span': {
      position: 'absolute',
      top: -9,
      right: 0,
      whiteSpace: 'nowrap',
    },
  },
  opacity: {
    opacity: .6,
  },
  error: {
    color: theme.palette.secondary.main,
  },
});

class Message extends React.Component {
  state = {
    status: 'loading',
    items: [],
    err_msg: '发生错误',
  };

  handleMarkAllMessage = async () => {
    const { accesstoken } = this.props;
    const params = {
      url: '/message/mark_all',
      params: { accesstoken },
    };

    const { success } = await post(params);

    if (success) {
      this.updateState();
      this.props.readAllMessage();
    }
  };

  updateState = () => {
    let { items } = this.state;

    items.map(item => item.has_read = true);

    this.setState({ items });
  };

  fetchMessages = async () => {
    const { accesstoken } = this.props;

    const params = {
      url: '/messages',
      params: {
        accesstoken,
        mdrender: false,
      },
    };

    const {
      success,
      data: {
        hasnot_read_messages: unRead = [],
        has_read_messages: hasRead = [],
      },
      err_msg,
    } = await getData(params);

    if (success) {
      this.props.updateMessage(unRead.length);

      this.setState({
        status: 'success',
        items: [ ...unRead, ...hasRead ],
      });
    } else {
      this.setState(state => ({
        status: 'error',
        err_msg: err_msg ? err_msg : state.err_msg,
      }));
    }
  };

  componentDidMount() {
    this.fetchMessages();
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthed, history } = nextProps;

    if (!isAuthed) {
      history.push('/');
    }
  }

  render() {
    const { classes, message } = this.props;
    const { status, items, err_msg } = this.state;

    return (
      <Layout>
        <Helmet title="消息" />

        <div className="wrapper">
          <Grid container alignItems="center" justify="flex-end" className={classes.spacings}>
            <Grid item className={classNames(classes.text, {
              [classes.opacity]: status !== 'success' || message.count === 0,
              [classes.error]: status === 'error',
            })}>
              <Fade unmountOnExit in={status === 'loading'}>
                <span>获取消息中……</span>
              </Fade>
              <Fade unmountOnExit in={status === 'error'}>
                <span>{err_msg}</span>
              </Fade>
              <Fade unmountOnExit in={status === 'success' && !Boolean(items.length)}>
                <span>没有消息哦</span>
              </Fade>
              <Fade unmountOnExit in={status === 'success' && Boolean(items.length) && !Boolean(message.count)}>
                <span>已读全部消息</span>
              </Fade>
              <Fade unmountOnExit in={status === 'success' && Boolean(message.count)}>
                <span>{message.count} 条未读消息</span>
              </Fade>
            </Grid>
            <Tooltip
              title="全部标为已读"
              enterDelay={500}
              placement="left-start"
              disableTouchListener
            >
              <span>
              <IconButton
                onClick={this.handleMarkAllMessage}
                disabled={status !== 'success' || message.count === 0}
                disableRipple
              >
                <MarkAllIcon />
              </IconButton>
              </span>
            </Tooltip>
          </Grid>

          {items.map(item => (
            <MessageCard key={item.id} item={item} hasRead={item.has_read} />
          ))}
        </div>

        <div className="status wrapper">
          <Progress status={status} />
        </div>
      </Layout>
    );
  }
}

Message.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, message }) => ({
  ...auth,
  message,
});

const mapDispatchToProps = dispatch => ({
  readAllMessage: () => {
    dispatch(readAllMessage());
  },
  updateMessage: count => {
    dispatch(updateMessage(count));
  },
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Message);
