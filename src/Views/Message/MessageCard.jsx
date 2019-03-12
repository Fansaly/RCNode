import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { readMessage } from '../../store/actions';
import { post } from '../../fetch';

import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AtIcon from '@material-ui/icons/AlternateEmail';
import ReplyIcon from '@material-ui/icons/Reply';
import NewTabIcon from '@material-ui/icons/OpenInNew';

import Avatar from '../../Components/Avatar';
import Moment from '../../Components/Moment';
import { MarkdownRender } from '../../Components/Markdown';

const styles = theme => ({
  unRead: {
    boxShadow: '0 1px 2px 0 rgba(245,0,87,.16),0 1px 1px 0 rgba(245,0,87,.12),0 2px 1px -1px rgba(245,0,87,.1)',
    '&:before': {
      backgroundColor: 'rgba(245,0,87,.12)',
    },
  },
  summary: {
    '@media (max-width: 768px)': {
      paddingLeft: 20,
      paddingRight: 20,
    },
    '@media (max-width: 600px)': {
      paddingLeft: 16,
      paddingRight: 16,
    },
    '@media (max-width: 420px)': {
      paddingLeft: 14,
      paddingRight: 14,
    },
  },
  content: {
    maxWidth: '100%',
  },
  moreUnRead: {
    color: 'rgba(245,0,87,.7)',
  },
  avatar: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: '1.5em',
  },
  uname: {
    fontWeight: 700,
  },
  time: {
    paddingLeft: 10,
    '& time': {
      marginLeft: 3,
    },
    '& div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sizeAt: {
    fontSize: 18,
    transform: 'translateY(-1px)',
  },
  sizeReply: {
    fontSize: 20,
    transform: 'translateY(-1.5px)',
  },
  gray: {
    color: 'rgba(0,0,0,.5)',
  },
  actions: {
    paddingLeft: 14,
    paddingRight: 14,
    '@media (max-width: 600px)': {
      paddingTop: 12,
      paddingBottom: 12,
    },
    '@media (max-width: 420px)': {
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
  btn: {
    padding: '6px 10px',
  },
  icon: {
    marginLeft: 2,
    fontSize: 14,
    transform: 'translateY(1px)',
  },
});

class MessageCard extends React.Component {
  constructor(props) {
    super(props);

    const { item } = this.props;

    this.state = { ...item };
  }

  markMessage = async () => {
    const { accesstoken } = this.props;
    const { id } = this.state;

    const params = {
      url: `/message/mark_one/${id}`,
      params: { accesstoken },
    };

    const { success } = await post(params);

    if (success) {
      this.props.readMessage();
      this.setState({ has_read: true });
    }
  };

  handleChange = (event, expanded) => {
    const { has_read } = this.state;

    if (!has_read) {
      this.markMessage();
    }
  };

  render() {
    const { classes, hasRead } = this.props;
    const {
      author,
      has_read,
      reply,
      topic,
      type,
    } = this.state;

    return (
      <ExpansionPanel
        className={classNames({
          [classes.unRead]: !has_read && !hasRead,
        })}
        onChange={this.handleChange}
      >
        <ExpansionPanelSummary
          classes={{
            root: classes.summary,
            content: classes.content,
            expandIcon: classNames({
              [classes.moreUnRead]: !has_read && !hasRead,
            }),
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Grid container wrap="nowrap" alignItems="center">
            <Grid item className={classes.avatar}>
              <Avatar
                name={author.loginname}
                image={author.avatar_url}
              />
            </Grid>
            <Grid container zeroMinWidth wrap="wrap" alignItems="center">
              <Grid container zeroMinWidth wrap="wrap" alignItems="center">
                <Typography noWrap component="h4" className={classes.title}>
                  {topic.title}
                </Typography>
              </Grid>
              <Grid container zeroMinWidth wrap="nowrap" alignItems="center">
                <Grid item zeroMinWidth>
                  <Typography noWrap component="span" className={classNames(classes.uname, classes.gray)}>
                    {author.loginname}
                  </Typography>
                </Grid>
                <Grid item className={classes.time}>
                  <Typography noWrap component="div" className={classes.gray}>
                    {type === 'reply' ? (
                      <ReplyIcon className={classes.sizeReply} />
                    ) : (
                      <AtIcon className={classes.sizeAt} />
                    )}
                    <Moment fromNow>{reply.create_at}</Moment>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <MarkdownRender markdownString={reply.content} />
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions className={classes.actions}>
          <Button
            component={Link}
            className={classes.btn}
            to={`/user/${author.loginname}`}
            target="_blank"
            size="medium"
          >
            浏览用户
            <NewTabIcon className={classes.icon} />
          </Button>
          <Button
            component={Link}
            className={classes.btn}
            to={`/topic/${topic.id}#${reply.id}`}
            target="_blank"
            size="medium"
            color="primary"
          >
            前往查看
            <NewTabIcon className={classes.icon} />
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

MessageCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

const mapDispatchToProps = dispatch => ({
  readMessage: () => {
    dispatch(readMessage());
  },
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MessageCard);
