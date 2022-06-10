import './progress.styl';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';

export type ProgressStatus = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  status?: ProgressStatus;
  className?: string;
  unmountOnExit?: boolean;
  onExited?: () => void;
}

const Progress = ({ className, status, unmountOnExit = true, onExited }: Props) => {
  const handleExited = () => {
    onExited?.();
  };

  return (
    <Grid id="progress" className={clsx(className)} item>
      <CSSTransition
        className="progress loading"
        classNames="progress"
        in={status === 'loading'}
        timeout={{ enter: 100, exit: 550 }}
        unmountOnExit={unmountOnExit}
        onExited={handleExited}
      >
        <CircularProgress classes={{ svg: 'loop-color' }} />
      </CSSTransition>
    </Grid>
  );
};

export default Progress;
