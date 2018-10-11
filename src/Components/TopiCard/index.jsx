import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeHtmlTags } from '../../common';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/Visibility';
import ReplyIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TopicTypeIcon from '../../Components/TopicTypeIcon';
import Avatar from '../../Components/Avatar';
import Moment from '../../Components/Moment';
import './topicard.styl';

const styles = theme => ({
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
});

class TopiCard extends React.Component {
  constructor(props) {
    super(props);

    const { cardPreview } = props;

    this.state = {
      expanded: cardPreview,
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded,
    }));
  };

  render() {
    const {
      className,
      classes,
      simple,
      item,
      width,
    } = this.props;

    const { expanded } = this.state;

    return (
      <Card className={classNames('topicard', {
        [className]: className,
        'expanded': !simple && expanded,
      })}>
        <Grid
          container
          spacing={0}
          alignItems={'center'}
          className="topicard-header-wrapper"
        >
          <Grid
            container
            className="topicard-header"
            alignItems={'center'}
            justify={'flex-start'}
            spacing={0}
          >
            <Avatar
              className="avatar"
              name={item.author.loginname}
              image={item.author.avatar_url}
              url={`/user/${item.author.loginname}`}
            />
            <Grid
              container
              className="topicard-title"
              alignItems={'center'}
              justify={'flex-start'}
              spacing={0}
            >
              <Grid item className="title">
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
                <Typography variant="h5">
                  <Link to={`/topic/${item.id}`}>{item.title}</Link>
                </Typography>
                {!simple &&
                  <CardActions className="action">
                    <IconButton
                      className={classNames(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={this.handleExpandClick}
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
          <Grid container
            className="state-wrapper"
            alignItems={'center'}
            spacing={0}
          >
            <Grid container
              className="state"
              alignItems={'center'}
              spacing={0}
            >
              <Grid item className="author">
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
        {!simple &&
          <Collapse
            className="collapse"
            in={expanded}
            timeout="auto"
            unmountOnExit={isWidthUp('sm', width)}
          >
            <CardContent className="context">
            {/**
             * https://material-ui.com/style/typography/#migration-to-typography-v2
             * ----------------------------------
             * old             =>  new
             * body2           => body1
             * body1 (default) => body2 (default)
             * ----------------------------------
             * current use old variant body2
             */}
              <Typography variant="body2">
                {removeHtmlTags(item.content)}
              </Typography>
            </CardContent>
          </Collapse>
        }
      </Card>
    );
  }
}

TopiCard.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

const mapStateToProps = ({ settings }) => ({
  cardPreview: settings.cardPreview,
});

export default compose(
  withStyles(styles),
  withWidth(),
  connect(
    mapStateToProps,
  ),
)(TopiCard);
