import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { get as getData } from '../../fetch';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AtIcon from '@material-ui/icons/AlternateEmail';
import ReplyIcon from '@material-ui/icons/Textsms';
import MarkIcon from '@material-ui/icons/Done';
import MarkAllIcon from '@material-ui/icons/DoneAll';

import Layout from '../../Layout';
import MessageCards from './MessageCards';
import './message.styl';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'unRead',
      items: [],
      count: undefined,
      unRead: [],
      hasRead: [],
    };
  }

  handleChange = (event, value) => {
    this.setState(state => ({
      value,
      items: state[value],
    }));
  };

  fetchUnreadCount = async () => {
    const { accesstoken } = this.props;

    const params = {
      url: '/message/count',
      params: { accesstoken },
    };

    const { success, data } = await getData(params);

    if (success) {
      this.setState({ count: data.data });
    }
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

    const { success, data } = await getData(params);

    if (success) {
      const {
        hasnot_read_messages: unRead,
        has_read_messages: hasRead,
      } = data;

      console.log({ unRead, hasRead });

      this.setState({
        items: unRead,
        unRead,
        hasRead,
      });
    }
  };

  componentDidMount() {
    this.fetchMessages();
    this.fetchUnreadCount();
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthed, history } = nextProps;

    if (!isAuthed) {
      history.push('/');
    } else {
      this.fetchMessages();
      this.fetchUnreadCount();
    }
  }

  render() {
    const {
      value,
      items,
      count,
    } = this.state;

    return (
      <Layout>
        <div className="wrapper">
          <div style={{ marginTop: '50px' }}>
            {Number.isInteger(count) &&
              <Typography>
                {count === 0 ? (
                  '没有未读消息'
                ) : (
                  `${count} 条未读消息`
                )}
              </Typography>
            }

            <Tabs value={value} onChange={this.handleChange}>
              <Tab value="unRead" label="未读消息" />
              <Tab value="hasRead" label="已读消息" />
            </Tabs>

            <div className={value.toLowerCase()}>
              <MessageCards messages={items} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

export default connect(
  mapStateToProps,
)(Message);
