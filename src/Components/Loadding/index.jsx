import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  },
});


class Loadding extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    );
  }
}

Loadding.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loadding);
