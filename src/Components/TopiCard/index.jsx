import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
  randomNumber,
  removeHtmlTags,
} from '../../common';

import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/Visibility';
import ReplyIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TopicTypeIcon from '../../Components/TopicTypeIcon';
import Avatar from '../../Components/Avatar';
import Moment from '../../Components/Moment';
import './topicard.styl';

const useStyles = makeStyles(theme => ({
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
      color: theme.palette.type === 'light' ? 'rgba(0,0,0,.92)' : 'rgba(200,200,200,.95)',
    },
  },
  state: {
    color: theme.palette.type === 'light' ? 'rgba(0,0,0,.5)' : 'rgba(125,125,125,.5)',
    '& button': {
      color: theme.palette.type === 'light' ? 'rgba(0,0,0,.4)' : 'rgba(125,125,125,.4)',
    },
  },
}));

const TopiCard = (props) => {
  const {
    item,
    simple = false,
    className,
    width,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const { cardPreview } = useSelector(state => state.settings);
  const [expanded, setExpanded] = React.useState(cardPreview);

  let targetRefs = [];

  const collectTrgetRefs = ref => {
    if (ref !== null) {
      targetRefs = [...targetRefs, ref];
    }
  };

  const substrContent = content => {
    const len = randomNumber({ min: 200, max: 400 });
    return removeHtmlTags(content).substr(0, len);
  };

  const handleExpandClick = () => {
    setExpanded(prevState => !prevState);
  };

  const handleClick = event => {
    if (targetRefs.includes(event.target)) {
      history.push(`/topic/${item.id}`);
    }
  };

  return (
    <Card className={clsx('topicard', className, {
      'expanded': !simple && expanded,
    })}>
      <Button
        component="div"
        className={classes.button}
        onClick={handleClick}
        disableFocusRipple
      >
        <Grid
          container
          alignItems="center"
          className="topicard-header-wrapper"
        >
          <Grid
            container
            alignItems="center"
            justify="flex-start"
            className="topicard-header"
            ref={ref => collectTrgetRefs(ref)}
          >
            <Avatar
              className="avatar"
              name={item.author.loginname}
              image={item.author.avatar_url}
              url={`/user/${item.author.loginname}`}
            />
            <Grid
              container
              alignItems="center"
              justify="flex-start"
              className="topicard-title"
            >
              <Grid item className={clsx('title', classes.title)}>
                {!simple &&
                  <Grid item className="type">
                    <IconButton>
                      <TopicTypeIcon
                        tab={item.tab}
                        good={item.good}
                        top={item.top}
                      />
                    </IconButton>
                  </Grid>
                }
                <Typography variant="h5" ref={ref => collectTrgetRefs(ref)}>
                  <Link to={`/topic/${item.id}`}>{item.title}</Link>
                </Typography>
                {!simple &&
                  <CardActions className="action">
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="Show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </CardActions>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid container wrap="nowrap" alignItems="center" className="state-wrapper"
            ref={ref => collectTrgetRefs(ref)}
          >
            <Grid container wrap="nowrap" alignItems="center" className={clsx('state', classes.state)}
              ref={ref => collectTrgetRefs(ref)}
            >
              <Grid container item zeroMinWidth wrap="nowrap" alignItems="center"
                ref={ref => collectTrgetRefs(ref)}
              >
                <Grid item zeroMinWidth className="author">
                  <Link to={`/user/${item.author.loginname}`}>
                    {item.author.loginname}
                  </Link>
                </Grid>
                {!simple &&
                  <Grid item className="create">
                    <IconButton><CreateIcon /></IconButton>
                    <Moment fromNow>{item.create_at}</Moment>
                  </Grid>
                }
              </Grid>
              <Grid item className="count">
                <Grid item className="reply">
                  <IconButton><ReplyIcon /></IconButton>
                  {!simple ? (
                    <span>{item.reply_count}</span>
                  ) : (
                    <Moment fromNow>{item.last_reply_at}</Moment>
                  )}
                </Grid>
                {!simple &&
                  <Grid item className="visit">
                    <IconButton><ViewIcon /></IconButton>
                    <span>{item.visit_count}</span>
                  </Grid>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Button>
      {!simple &&
        <Collapse
          className="collapse"
          in={expanded}
          timeout="auto"
          unmountOnExit={isWidthUp('sm', width)}
        >
          <CardContent className="context">
            <Typography>
              {substrContent(item.content)}
            </Typography>
          </CardContent>
        </Collapse>
      }
    </Card>
  );
};

TopiCard.propTypes = {
  item: PropTypes.object.isRequired,
  simple: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.string.isRequired,
};

export default withWidth()(TopiCard);
