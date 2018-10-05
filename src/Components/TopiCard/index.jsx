import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { removeHtmlTags } from '../../common';

import { withStyles } from '@material-ui/core/styles';
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
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded,
    }));
  };

  render() {
    const { expanded } = this.state;
    const {
      classes,
      className,
      simple,
      item,
    } = this.props;

    return (
      <Card className={classNames('topicard', {
        [className]: className,
        'expanded': expanded,
      })}>
        <Grid container
          alignItems={'center'}
          spacing={0}
        >
          <CardContent className="cardHeaderWrap">
            <Grid container
              className="cardHeader"
              alignItems={'center'}
              justify={'flex-start'}
              spacing={0}
            >
              <Avatar
                name={item.author.loginname}
                image={item.author.avatar_url}
                url={`/user/${item.author.loginname}`}
                className="avatar"
              />
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
              <Grid item className="title">
                <Typography variant="headline" component="h4">
                  <Link to={`/topic/${item.id}`}>{item.title}</Link>
                </Typography>
              </Grid>
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
          </CardContent>
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
        {!simple &&
          <Collapse in={expanded} timeout="auto" unmountOnExit className="collapse">
            <CardContent className="context">
              <Typography variant="body2" component="p">
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
};

export default withStyles(styles)(TopiCard);
