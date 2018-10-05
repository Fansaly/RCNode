import React from 'react';
import { connect } from 'react-redux';
import { get as getData } from '../../api';

import Typography from '@material-ui/core/Typography';

import Layout from '../../Layout';
import MessageCards from './MessageCards';
import './message.styl';

const __testData__ = {
  has_read_messages: [],
  hasnot_read_messages: [
    {
      id: 'id',
      type: 'at',
      has_read: false,
      author: {
        loginname: 'loginname',
        avatar_url: 'avatar_url',
      },
      topic: {
        id: 'topic',
        title: 'title',
        last_reply_at: '2018-10-05T10:00:00.000Z',
      },
      reply: {
        id: 'reply',
        content: 'content',
        ups: [ ],
        create_at: '2018-10-05T10:00:00.000Z',
      },
    },
  ],
};

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: undefined,
      unRead: [],
      hasRead: [],
    };
  }

  fetchUnreadCount = async () => {
    const { isAuthed, accesstoken } = this.props;

    if (!isAuthed) { return; }

    const params = {
      url: '/message/count',
      params: { accesstoken },
    };

    const { status, data } = await getData(params);

    if (status) {
      this.setState({ count: data.data });
    }
  };

  fetchMessages = async () => {
    const { isAuthed, accesstoken } = this.props;

    if (!isAuthed) { return; }

    const params = {
      url: '/messages',
      params: {
        accesstoken,
        mdrender: false,
      },
    };

    const { status, data } = await getData(params);

    console.log(data);

    if (status) {
      const unRead = __testData__.hasnot_read_messages;
      const hasRead = __testData__.has_read_messages;

      this.setState({ unRead, hasRead });
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
    const { count, unRead, hasRead } = this.state;

    return (
      <Layout>
        <div className="wrapper">
          <div style={{ marginTop: '50px' }}>
            {Number.isInteger(count) &&
              <Typography component="p">
                {count === 0 ? (
                  '没有未读消息'
                ) : (
                  `${count} 条未读消息`
                )}
              </Typography>
            }

            <div className="unread">
              <MessageCards messages={unRead} />
            </div>
            <div className="hasread">
              <MessageCards messages={hasRead} />
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
