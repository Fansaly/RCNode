import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import SuccessIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '@material-ui/core/Button';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './progress.styl';

class Progress extends React.Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  timer = null;

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timer);

    const { status } = nextProps;

    if (status !== 'loading') {
      this.timer = setTimeout(() => {
        this.setState({ status: 'idle' });
      }, 2400);
    }

    this.setState({ status });
  }

  render() {
    const { status } = this.state;

    return (
      <TransitionGroup id="progress">
        {status === 'loading' &&
          <CSSTransition
            classNames="fade"
            className="progress loading"
            timeout={{enter: 800, exit: 600}}
          >
            <CircularProgress />
          </CSSTransition>
        }
        {status === 'success' &&
          <CSSTransition
            classNames="fade"
            className="progress success"
            timeout={{enter: 800, exit: 600}}
          >
            <SuccessIcon/>
          </CSSTransition>
        }
        {status === 'error' &&
          <CSSTransition
            classNames="fade"
            className="progress error"
            timeout={{enter: 800, exit: 600}}
          >
            <ErrorIcon/>
          </CSSTransition>
        }
        {status === 'idle' &&
          <CSSTransition
            classNames="fade"
            className="progress idle"
            timeout={{enter: 800, exit: 600}}
          >
            <Button onClick={this.props.handle}>
              获取更多
            </Button>
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default Progress;
