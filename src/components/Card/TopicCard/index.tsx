import './topicard.styl';

import ReplyIcon from '@mui/icons-material/Comment';
import CreateIcon from '@mui/icons-material/Create';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import { TabIcon } from '@/components/Icons';
import { useBreakpoints } from '@/hooks';
import { useSelector } from '@/store';
import { dayjs, randomNumber } from '@/utils';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'flex',
    padding: 0,
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    textTransform: 'inherit',
  },
  expand: {
    margin: 0,
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  title: {
    '& h5': {
      color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.92)' : 'rgba(200,200,200,.95)',
    },
  },
  state: {
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.5)' : 'rgba(125,125,125,.5)',
    '& button': {
      color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.4)' : 'rgba(125,125,125,.4)',
    },
  },
}));

interface Props {
  className?: string;
  simple?: boolean;
  item: any;
}

const TopicCard = ({ className, simple = false, item }: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isWidthUpSm = useBreakpoints('up', 'sm');

  const { cardPreview } = useSelector((state) => state.settings);
  const [expanded, setExpanded] = React.useState<boolean>(cardPreview);

  const targetRefs: HTMLElement[] = [];

  const collectTrgetRefs = (ref: null | HTMLElement) => {
    if (ref !== null) {
      targetRefs.push(ref);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (targetRefs.includes(event.target as HTMLDivElement)) {
      navigate(`/topic/${item.id}`);
    }
  };

  const handleClickExpand = () => {
    setExpanded((prevState) => !prevState);
  };

  const substrContent = (content: string) => {
    const len = randomNumber({ min: 200, max: 400 });
    content = content.replace(/<[^>]+>/g, '');
    return content.substr(0, len);
  };

  return (
    <Card
      className={clsx('topicard', className, {
        expanded: !simple && expanded,
      })}
    >
      <Button
        className={classes.button}
        component="div"
        disableFocusRipple
        onClick={handleClick}
      >
        <Grid className="topicard-header-wrapper" container alignItems="center">
          <Grid
            ref={(ref) => collectTrgetRefs(ref)}
            className="topicard-header"
            container
            alignItems="center"
            justifyContent="flex-start"
          >
            <Avatar
              className="avatar"
              name={item.author.loginname}
              image={item.author.avatar_url}
              url={`/user/${item.author.loginname}`}
            />
            <Grid
              className="topicard-title"
              container
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid className={clsx('title', classes.title)} item>
                {!simple && (
                  <Grid className="type" item>
                    <IconButton size="large">
                      <TabIcon tab={item.tab} good={item.good} top={item.top} />
                    </IconButton>
                  </Grid>
                )}
                <Typography ref={(ref) => collectTrgetRefs(ref)} variant="h5">
                  <Link to={`/topic/${item.id}`}>{item.title}</Link>
                </Typography>
                {!simple && (
                  <CardActions className="action">
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      aria-expanded={expanded}
                      aria-label="Show more"
                      size="large"
                      onClick={handleClickExpand}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            ref={(ref) => collectTrgetRefs(ref)}
            className="state-wrapper"
            container
            wrap="nowrap"
            alignItems="center"
          >
            <Grid
              ref={(ref) => collectTrgetRefs(ref)}
              className={clsx('state', classes.state)}
              container
              wrap="nowrap"
              alignItems="center"
            >
              <Grid
                ref={(ref) => collectTrgetRefs(ref)}
                container
                item
                zeroMinWidth
                wrap="nowrap"
                alignItems="center"
              >
                <Grid className="author" item zeroMinWidth>
                  <Link to={`/user/${item.author.loginname}`}>
                    {item.author.loginname}
                  </Link>
                </Grid>
                {!simple && (
                  <Grid className="create" item>
                    <IconButton size="large">
                      <CreateIcon />
                    </IconButton>
                    {dayjs(item.create_at).fromNow()}
                  </Grid>
                )}
              </Grid>
              <Grid className="count" item>
                <Grid className="reply" item>
                  <IconButton size="large">
                    <ReplyIcon />
                  </IconButton>
                  {!simple ? (
                    <span>{item.reply_count}</span>
                  ) : (
                    dayjs(item.last_reply_at).fromNow()
                  )}
                </Grid>
                {!simple && (
                  <Grid className="visit" item>
                    <IconButton size="large">
                      <ViewIcon />
                    </IconButton>
                    <span>{item.visit_count}</span>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Button>
      {!simple && (
        <Collapse
          className="collapse"
          in={expanded}
          timeout="auto"
          unmountOnExit={isWidthUpSm}
        >
          <CardContent className="context">
            <Typography>{substrContent(item.content)}</Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
};

export default TopicCard;
