import AtIcon from '@mui/icons-material/AlternateEmail';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NewTabIcon from '@mui/icons-material/OpenInNew';
import ReplyIcon from '@mui/icons-material/Reply';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';

import { markSingleMessage } from '@/api';
import Avatar from '@/components/Avatar';
import MarkdownRender from '@/components/Markdown';
import { useDispatch, useSelector } from '@/store';
import { dayjs } from '@/utils';

const useStyles = makeStyles((theme) => ({
  unRead: {
    boxShadow:
      '0 1px 2px 0 rgba(245,0,87,.16),0 1px 1px 0 rgba(245,0,87,.12),0 2px 1px -1px rgba(245,0,87,.1)',
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
    '& div': {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: 3,
      },
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
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.5)' : 'rgba(130,130,130,.5)',
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

interface Props {
  item: any;
  hasRead: boolean;
}

const MessageCard = ({ item, hasRead }: Props) => {
  const classes = useStyles();
  const disptach = useDispatch();

  const { accesstoken } = useSelector((state) => state.auth);
  const [state, setState] = React.useState<any>({ ...item });
  const isCancel = React.useRef<boolean>(false);

  const markMessage = async () => {
    isCancel.current = false;

    const { success } = await markSingleMessage({
      accesstoken,
      msg_id: state.id,
    });

    if (!isCancel.current && success) {
      disptach({ type: 'message/read' });
      setState((prevState: any) => ({ ...prevState, has_read: true }));
    }
  };

  const handleChange = () => {
    if (!state.has_read) {
      markMessage();
    }
  };

  React.useEffect(() => {
    return () => {
      isCancel.current = true;
    };
  }, []);

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
          expandIconWrapper: clsx({
            [classes.moreUnRead]: !state.has_read && !hasRead,
          }),
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Grid container wrap="nowrap" alignItems="center">
          <Grid className={classes.avatar} item>
            <Avatar name={state.author.loginname} image={state.author.avatar_url} />
          </Grid>
          <Grid container item zeroMinWidth wrap="wrap" alignItems="center">
            <Grid container item zeroMinWidth wrap="wrap" alignItems="center">
              <Typography className={classes.title} component="h4" noWrap>
                {state.topic.title}
              </Typography>
            </Grid>
            <Grid container item zeroMinWidth wrap="nowrap" alignItems="center">
              <Grid item zeroMinWidth>
                <Typography
                  className={clsx(classes.uname, classes.gray)}
                  component="span"
                  noWrap
                >
                  {state.author.loginname}
                </Typography>
              </Grid>
              <Grid className={classes.time} item>
                <Typography className={classes.gray} component="div" noWrap>
                  {state.type === 'reply' ? (
                    <ReplyIcon className={classes.sizeReply} />
                  ) : (
                    <AtIcon className={classes.sizeAt} />
                  )}
                  {dayjs(state.reply.create_at).fromNow()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <MarkdownRender markdownSource={state.reply.content} />
      </AccordionDetails>
      <Divider />
      <AccordionActions className={classes.actions}>
        <Button
          className={classes.btn}
          component={Link}
          to={`/user/${state.author.loginname}`}
          target="_blank"
          color="secondary"
          size="medium"
        >
          浏览用户
          <NewTabIcon className={classes.icon} />
        </Button>
        <Button
          className={classes.btn}
          component={Link}
          to={`/topic/${state.topic.id}#${state.reply.id}`}
          target="_blank"
          color="primary"
          size="medium"
        >
          主题中查看
          <NewTabIcon className={classes.icon} />
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default MessageCard;
