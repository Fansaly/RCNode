import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { MarkdownRender } from '../../Components/Markdown';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

class MessageCards extends React.Component {
  render() {
    const { classes, messages } = this.props;

    return (
      <React.Fragment>
        {messages.map(data => (
          <Paper key={data.id} className={classes.root} elevation={1}>
            <Typography variant="h5">
              {data.topic.title}
            </Typography>
            <MarkdownRender markdownString={data.reply.content} />
          </Paper>
        ))}
      </React.Fragment>
    );
  }
}

MessageCards.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  ...auth,
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
  ),
)(MessageCards);
