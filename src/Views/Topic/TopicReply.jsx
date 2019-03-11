import React from 'react';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  openShare,
  openEditor,
  openNotification,
} from '../../store/actions';
import { post as POST } from '../../fetch';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import UpdateIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import ThumbUpIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpCancelIcon from '@material-ui/icons/ThumbUpAltOutlined';
import SortIcon from '@material-ui/icons/Sort';

import { MarkdownRender } from '../../Components/Markdown';
import Moment from '../../Components/Moment';

class TopicReply extends React.Component {
  constructor(props) {
    super(props);

    const { topic_id } = props.match.params;
    const { author, index } = props;
    const {
      author: {
        loginname: uname,
        avatar_url: avatar,
      },
      is_uped: isUped,
      ...other
    } = props.item;

    this.state = {
      author,
      topic_id,
      post: index + 1,
      uname,
      avatar,
      isUped,
      ...other,
      ups: other.ups.length,
      URL: '',
    };
  }

  handleUpdate = () => {
    console.log('update');
  };

  handleDelete = () => {
    console.log('delete');
  };

  handleReply = () => {
    const {
      topic_id,
      uname,
      id,
    } = this.state;
    const config = {
      action: 'reply',
      url: `/topic/${topic_id}/replies`,
      reply_id: id,
      content: `@${uname} `,
    };

    this.props.openEditor(config);
  };

  handleUp = async () => {
    if (!this.props.isAuthed) {
      return;
    }

    const {
      accesstoken,
      uname: signedUname,
    } = this.props;

    let {
      id,
      uname,
      isUped,
      ups,
    } = this.state;

    const params = {
      url: `/reply/${id}/ups`,
      params: { accesstoken },
    };

    if (uname === signedUname) {
      this.props.openNotification('不能 👍 自己的哟~');
    } else {
      const { success, err_msg } = await POST(params);

      if (success) {
        this.setState({
          isUped: !isUped,
          ups: isUped ? (--ups) : (++ups),
        });
      } else if (err_msg) {
        this.props.openNotification({
          message: err_msg,
          status: 'error',
        });
      }
    }
  };

  handleShare = () => {
    const { id, post, URL } = this.state;

    this.props.openShare({
      url: `${URL}#${id}`,
      post,
    });
  };

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const { origin, pathname } = window.location;

      this.setState({
        URL: `${origin}${pathname}`,
      });
    }
  }

  render() {
    const {
      isAuthed,
      uname: signedUname,
    } = this.props;
    const {
      author,
      id,
      post,
      uname,
      avatar,
      isUped,
      ups,
      create_at,
      content,
    } = this.state;

    return (
      <div className={classNames('topic-reply', {
        'owned': uname === author,
      })}>
        <div className="reply-content">
          <div className="reply-header">
            <div className="avatar-uname">
              <Avatar aria-label="Recipe" className="avatar">
                <Link to={uname ? `/user/${uname}` : '/'}>
                  {avatar &&
                    <img
                      src={avatar}
                      alt={uname || '用户已注销'}
                    />
                  }
                </Link>
              </Avatar>
              <Link to={uname ? `/user/${uname}` : '/'}>
                {uname ? uname : '用户已注销'}
              </Link>
            </div>

            <div className="time-etc">
              {uname === author &&
                <span className="special">[作者]</span>
              }
              <span>回复于</span>
              <Moment fromNow>{create_at}</Moment>
            </div>

            <div className="actions">
              {isAuthed &&
                <React.Fragment>
                  {false && uname === signedUname &&
                    <React.Fragment>
                      <IconButton
                        className="action update"
                        onClick={this.handleUpdate}
                      >
                        <UpdateIcon />
                      </IconButton>
                      <IconButton
                        className="action delete"
                        onClick={this.handleDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </React.Fragment>
                  }
                  <IconButton
                    className="action reply"
                    onClick={this.handleReply}
                  >
                    <ReplyIcon />
                  </IconButton>
                </React.Fragment>
              }
              <IconButton
                className="action up"
                onClick={this.handleUp}
              >
                {isUped ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpCancelIcon />
                )}
              </IconButton>
              {Boolean(ups) &&
                <span className="num">{ups}</span>
              }
              <IconButton
                className="action post"
                id={`#${id}`}
                onClick={this.handleShare}
              >
                <SortIcon />
              </IconButton>
              <span className="num">{post}</span>
            </div>
          </div>

          <div className="markdown-container">
            <MarkdownRender markdownString={content} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

const mapDispatchToProps = dispatch => ({
  openShare: url => {
    dispatch(openShare(url));
  },
  openEditor: config => {
    dispatch(openEditor(config));
  },
  openNotification: message => {
    dispatch(openNotification(message));
  },
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TopicReply);
