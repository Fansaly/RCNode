import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './progress.styl';

class Progress extends React.Component {
  render() {
    const { status } = this.props;

    return (
      <TransitionGroup
        id="progress"
        className={this.props.className}
      >
        {status === 'loading' &&
          <CSSTransition
            classNames="fade"
            className="progress loading"
            timeout={{ enter: 0, exit: 550 }}
          >
            <CircularProgress />
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default Progress;
