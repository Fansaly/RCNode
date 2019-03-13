import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CSSTransition } from 'react-transition-group';

import './progress.styl';

class Progress extends React.Component {
  handleExited = () => {
    const { onExited } = this.props;
    Boolean(onExited) && onExited();
  };

  render() {
    const { className, status } = this.props;

    return (
      <Grid item id="progress" className={classNames(className)}>
        <CSSTransition
          className="progress loading"
          classNames="fade"
          in={status === 'loading'}
          timeout={{ enter: 100, exit: 550 }}
          onExited={this.handleExited}
          unmountOnExit
        >
          <CircularProgress classes={{ svg: 'loop-color' }} />
        </CSSTransition>
      </Grid>
    );
  }
}

Progress.propTypes = {
  status: PropTypes.oneOf(['idle', 'loading', 'success', 'error']).isRequired,
  onExited: PropTypes.func,
};

export default Progress;
