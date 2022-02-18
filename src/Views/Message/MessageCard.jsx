import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { post } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
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

const useStyles = makeStyles(theme => ({
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
    minWidth: 0,
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
    display: 'block',
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
    color: theme.palette.type === 'light' ? 'rgba(0,0,0,.5)' : 'rgba(130,130,130,.5)',
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
  },
}));

const MessageCard = (props) => {
  const [state, setState] = React.useState({ ...props.item });
  const { accesstoken } = useSelector(({ auth }) => auth);
  const disptach = useDispatch();
  const isCancel = React.useRef(false);

  React.useEffect(() => {
    return () => isCancel.current = true;
  }, []);

  const markMessage = async () => {
    const params = {
      url: `/message/mark_one/${state.id}`,
      params: { accesstoken },
    };

    const { success } = await post(params);

    if (!isCancel.current && success) {
      disptach({ type: 'READ_MESSAGE' });
      setState(prevState => ({ ...prevState, has_read: true }));
    }
  };

  const handleChange = (event, expanded) => {
    if (!state.has_read) {
      markMessage();
    }
  };

  const classes = useStyles();
  const { hasRead } = props;

  return (
    <Accordion
      className={clsx({
        [classes.unRead]: !state.has_read && !hasRead,
      })}
      onChange={handleChange}
    >
      <AccordionSummary
        classes={{
          root: classes.summary,
          content: classes.content,
          expandIcon: clsx({
            [classes.moreUnRead]: !state.has_read && !hasRead,
          }),
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Grid container wrap="nowrap" alignItems="center">
          <Grid item className={classes.avatar}>
            <Avatar
              name={state.author.loginname}
              image={state.author.avatar_url}
            />
          </Grid>
          <Grid container item zeroMinWidth wrap="wrap" alignItems="center">
            <Grid container item zeroMinWidth wrap="wrap" alignItems="center">
              <Typography noWrap component="h4" className={classes.title}>
                {state.topic.title}
              </Typography>
            </Grid>
            <Grid container item zeroMinWidth wrap="nowrap" alignItems="center">
              <Grid item zeroMinWidth>
                <Typography noWrap component="span" className={clsx(classes.uname, classes.gray)}>
                  {state.author.loginname}
                </Typography>
              </Grid>
              <Grid item className={classes.time}>
                <Typography noWrap component="div" className={classes.gray}>
                  {state.type === 'reply' ? (
                    <ReplyIcon className={classes.sizeReply} />
                  ) : (
                    <AtIcon className={classes.sizeAt} />
                  )}
                  <Moment fromNow>{state.reply.create_at}</Moment>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <MarkdownRender markdownString={state.reply.content} />
      </AccordionDetails>
      <Divider />
      <AccordionActions className={classes.actions}>
        <Button
          component={Link}
          className={classes.btn}
          to={`/user/${state.author.loginname}`}
          target="_blank"
          size="medium"
        >
          浏览用户
          <NewTabIcon className={classes.icon} />
        </Button>
        <Button
          component={Link}
          className={classes.btn}
          to={`/topic/${state.topic.id}#${state.reply.id}`}
          target="_blank"
          size="medium"
          color="primary"
        >
          前往查看
          <NewTabIcon className={classes.icon} />
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

MessageCard.propTypes = {
  item: PropTypes.object.isRequired,
  hasRead: PropTypes.bool.isRequired,
};

export default MessageCard;
