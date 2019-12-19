import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CSSTransition } from 'react-transition-group';

import './progress.styl';

const Progress = (props) => {
  const { className, status, unmountOnExit = true } = props;

  const handleExited = () => {
    const { onExited } = props;
    Boolean(onExited) && onExited();
  };

  return (
    <Grid item id="progress" className={clsx(className)}>
      <CSSTransition
        className="progress loading"
        classNames="progress"
        in={status === 'loading'}
        timeout={{ enter: 100, exit: 550 }}
        onExited={handleExited}
        unmountOnExit={unmountOnExit}
      >
        <CircularProgress classes={{ svg: 'loop-color' }} />
      </CSSTransition>
    </Grid>
  );
};

Progress.propTypes = {
  status: PropTypes.oneOf(['idle', 'loading', 'success', 'error']).isRequired,
  onExited: PropTypes.func,
  unmountOnExit: PropTypes.bool,
};

export default Progress;
