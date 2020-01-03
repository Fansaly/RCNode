import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import ZoomInIcon from '@material-ui/icons/Add';
import ZoomOutIcon from '@material-ui/icons/Remove';
import ZoomResetIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  fill: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: theme.palette.type === 'light' ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.92)',
  },
  actions: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    padding: '0 18px',
    backgroundColor: theme.palette.type === 'light' ? '#fff' : '#212121',
    boxShadow: '0 0 1px rgba(0,0,0,.03), 0 0 2px rgba(0,0,0,.08)',
    [theme.breakpoints.up('sm')]: {
      height: 64,
      padding: '0 24px',
    },
  },
  container: {
    display: 'flex',
    margin: 0,
    paddingTop: 56,
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    maxHeight: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    userSelect: 'none',
    outline: 'none',
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
  },
  content: {
    display: 'flex',
    padding: 0,
  },
  wrap: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    outline: 'none',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
  box: {
    position: 'relative',
    opacity: 0,
    transform: 'scale(.9)',
    transition: 'transform .15s cubic-bezier(0,0,.2,1), opacity 85ms linear 65ms',
    '&.ready': {
      opacity: 1,
      transform: 'none',
      transitionDuration: '.18s, 85ms',
      transitionDelay: '0s, 0s',
    },
  },
  target: {
    display: 'block',
    position: 'relative',
    transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
    boxShadow: ' 0 2px 6px rgba(0,0,0,.16), 0 1px 4px rgba(0,0,0,.03)',
    cursor: 'default',
    '&.drag-enabled': {
      cursor: 'grab',
      '&.drag-active': {
        cursor: 'grabbing',
        transition: 'none',
      },
    },
  },
  zoom: {
    position: 'fixed',
    display: 'flex',
    flexWrap: 'nowrap',
    padding: '0 8px',
    left: 30,
    bottom: 32,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: theme.palette.type === 'light' ? '#fff' : '#212121',
    boxShadow: '0 0 2px rgba(0,0,0,.1), 0 2px 5px rgba(0,0,0,.16)',
    zIndex: 1,
  },
  btn: {
    padding: 10,
    minWidth: 44,
    borderRadius: 0,
  },
}));

const defaultState = {
  /**
   * position
   * ------------------
   *  x, y => transform
   * iX,iY => initial transform pos for drag beginning
   * sX,sY => drag start
   * mX,mY => drag move
   */
  x: 0,
  y: 0,
  iX: 0,
  iY: 0,
  sX: 0,
  sY: 0,
  mX: 0,
  mY: 0,
  /**
   * scale
   * ------------------------
   * scale => transform scale
   */
  scale: 1,
  scaleLevel: 1,
  scaleLevels: [ .68, 1, 1.38, 2, 3.21, 4.96 ],
  /**
   * spacings
   * --------
   * spacings => initial, between zoomRef and zoomWrapRef
   * dragSpacings => drag, between zoomRef and zoomWrapRef
   */
  spacings: 16,
  dragSpacings: 50,
  disabledUp: false,
  disabledDown: false,
  disabledReset: true,
  dragEnabled: false,
  dragActive: false,
  isTouch: undefined,
  ready: false,
};

const ImageZoom = (props) => {
  const { width } = props;
  const { open, src } = useSelector(({ zoom }) => zoom);
  const [state, setState] = React.useState(defaultState);
  const dragIsActive = React.useRef();
  const zoomWrapRef = React.useRef();
  const zoomBoxRef = React.useRef();
  const zoomRef = React.useRef();
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClick = event => {
    const { target } = event;
    if (
      !state.ready
      || target === zoomWrapRef.current
      || target === zoomBoxRef.current
    ) {
      handleClose();
    }
  };

  const handleShare = () => {
    const url = zoomRef.current.src;
    dispatch({ type: 'OPEN_SHARE', data: url });
  };

  const handleClose = React.useCallback(() => {
    dispatch({ type: 'CLOSE_ZOOM' });
  }, [dispatch]);

  React.useEffect(() => {
    return () => open && handleClose();
  }, [open, handleClose]);

  const setViewport = () => {
    const viewport = document.head.querySelector('meta[name="viewport"]');
    const content = viewport.content;
    const scalable = 'user-scalable=no';

    viewport.content = `${content}, ${scalable}`;

    setState(prevState => ({
      ...prevState,
      viewport,
      content,
    }));
  };

  const resetViewport = () => {
    const { viewport, content } = state;
    viewport && (viewport.content = content);
  };

  const zoomExit = () => {
    resetViewport();
    setState(defaultState);
  };

  const zoomInit = () => {
    if (zoomRef.current.complete) {
      initState();
    } else {
      zoomRef.current.addEventListener('load', initState);
    }
  };

  const initState = () => {
    const { spacings } = defaultState;
    const isTouch = 'ontouchstart' in window;

    const { naturalWidth, naturalHeight } = zoomRef.current;

    const wrapWidth = zoomWrapRef.current.clientWidth;
    const wrapHeight = zoomWrapRef.current.clientHeight;

    const maxWidth = wrapWidth - 2 * spacings;
    const maxHeight = wrapHeight - 2 * spacings;

    let initialHeight = naturalHeight;

    if (naturalWidth > maxWidth) {
      initialHeight *= maxWidth / naturalWidth;
    }

    if (initialHeight > maxHeight) {
      initialHeight = maxHeight;
    }

    const initialWidth = naturalWidth * initialHeight / naturalHeight;

    setState({
      ...defaultState,
      ready: true,
      isTouch,
      wrapWidth,
      wrapHeight,
      maxWidth,
      maxHeight,
      naturalWidth,
      naturalHeight,
      initialWidth,
      initialHeight,
    });
  };

  // bind drag events, set viewport
  React.useEffect(() => {
    const isTouch = state.isTouch;

    if (typeof isTouch !== 'boolean') {
      return;
    }

    const getDragThreshold = options => {
      const {
        scale,
        wrapWidth,
        wrapHeight,
        maxWidth,
        maxHeight,
        initialWidth,
        initialHeight,
      } = options;
      const { dragSpacings } = defaultState;

      const currentWidth = initialWidth * scale;
      const currentHeight = initialHeight * scale;

      const tX = currentWidth > maxWidth
                 ? Math.max(0, (currentWidth - wrapWidth) / 2 + dragSpacings)
                 : 0;
      const tY = currentHeight > maxHeight
                 ? Math.max(0, (currentHeight - wrapHeight) / 2 + dragSpacings)
                 : 0;

      return { tX, tY };
    };

    const getTransformPos = options => {
      const { iX, iY, sX, sY, mX, mY } = options;
      const { tX, tY } = getDragThreshold(options);

      let x, y;

      x = iX + mX - sX;
      y = iY + mY - sY;

      x = Math.min(tX, Math.max(-tX, x));
      y = Math.min(tY, Math.max(-tY, y));

      return { x, y };
    };

    const getEventPos = event => {
      const x = isTouch ? event.touches[0].pageX : event.clientX;
      const y = isTouch ? event.touches[0].pageY : event.clientY;

      return { x, y };
    };

    const dragStart = event => {
      event.preventDefault();

      if (!state.dragEnabled) { return; }

      const { x, y } = getEventPos(event);

      setState(prevState => ({
        ...prevState,
        sX: x,
        sY: y,
        dragActive: true,
      }));
    };

    const dragMove = event => {
      event.preventDefault();

      if (!dragIsActive.current) { return; }

      const { x: mX, y: mY } = getEventPos(event);

      setState(prevState => {
        const { x, y } = getTransformPos({ ...prevState, mX, mY });
        return { ...prevState, x, y, mX, mY };
      });
    };

    const dragEnd = event => {
      event.preventDefault();

      if (!dragIsActive.current) { return; }

      setState(prevState => ({
        ...prevState,
        iX: prevState.x,
        iY: prevState.y,
        dragActive: false,
      }));
    };

    const bindEvents = () => {
      const eStart = isTouch ? 'touchstart' : 'mousedown';
      const eMove = isTouch ? 'touchmove' : 'mousemove';
      const eEnd = isTouch ? 'touchend' : 'mouseup';
      const eCancel = isTouch ? 'touchcancel' : 'mouseleave';

      zoomRef.current.addEventListener(eStart, dragStart);
      zoomRef.current.addEventListener(eMove, dragMove);
      zoomRef.current.addEventListener(eEnd, dragEnd);
      zoomRef.current.addEventListener(eCancel, dragEnd);
    };

    bindEvents();
    setViewport();
  }, [state.isTouch, state.dragEnabled]);

  React.useEffect(() => {
    dragIsActive.current = state.dragActive;
  }, [state.dragActive]);

  const handleZoom = action => event => {
    let { scaleLevel, scaleLevels } = state;

    const baseScaleLevel = 1;
    const minScaleLevel = 0;
    const maxScaleLevel = scaleLevels.length - 1;

    switch (action) {
      case 'up':
        scaleLevel++;
        break;
      case 'down':
        scaleLevel--;
        break;
      case 'reset':
        scaleLevel = baseScaleLevel;
        break;
      default:
        return;
    }

    scaleLevel = Math.min(
      Math.max(scaleLevel, minScaleLevel),
      maxScaleLevel
    );

    const scale = scaleLevels[scaleLevel];
    const disabledUp = scaleLevel === maxScaleLevel;
    const disabledDown = scaleLevel === minScaleLevel;
    const disabledReset = scaleLevel === baseScaleLevel;

    setState(prevState => ({
      ...prevState,
      x: 0,
      y: 0,
      iX: 0,
      iY: 0,
      scale,
      scaleLevel,
      disabledUp,
      disabledDown,
      disabledReset,
    }));
  };

  // update drag status
  React.useEffect(() => {
    if (!state.ready) {
      return;
    }

    const scale = state.scale;
    const maxWidth = state.maxWidth;
    const maxHeight = state.maxHeight;
    const initialWidth = state.initialWidth;
    const initialHeight = state.initialHeight;

    const currentWidth = initialWidth * scale;
    const currentHeight = initialHeight * scale;

    const dragEnabled = currentWidth > maxWidth || currentHeight > maxHeight;

    setState(prevState => ({
      ...prevState,
      dragEnabled,
    }));
  }, [
    // observed deps
    state.scale,
    // other deps
    state.ready,
    state.maxWidth, state.maxHeight, state.initialWidth, state.initialHeight,
  ]);

  // update transform style
  React.useEffect(() => {
    if (!Boolean(zoomRef.current)) {
      return;
    }

    const transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    zoomRef.current.style.transform = transform;
  }, [state.x, state.y, state.scale]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={false}
      onClose={handleClose}
      onEnter={zoomInit}
      onExited={zoomExit}
      BackdropProps={{ className: classes.backdrop }}
      PaperProps={{ className: classes.container }}
      keepMounted={isWidthDown('xs', width)}
    >
      <Grid className={classes.actions}>
        <Grid className={classes.fill}>
          <IconButton
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <IconButton
          className={classes.share}
          onClick={handleShare}
          disabled={!state.ready}
        >
          <ShareIcon />
        </IconButton>
      </Grid>
      <DialogContent className={classes.content}>
        <div
          ref={zoomWrapRef}
          className={classes.wrap}
          onClick={handleClick}
          onKeyUp={() => {}}
          role="grid"
          tabIndex="-1"
        >
          <Fade
            in={!state.ready}
            className={classes.loading}
          >
            <CircularProgress />
          </Fade>
          <div
            ref={zoomBoxRef}
            className={clsx(classes.box, {
              'ready': state.ready,
            })}
          >
            <img
              ref={zoomRef}
              className={clsx(classes.target, {
                'drag-enabled': state.dragEnabled,
                'drag-active': state.dragActive,
              })}
              style={{ height: state.initialHeight || 'auto' }}
              src={src}
              alt="zoom"
            />
          </div>
        </div>
        <Grid className={classes.zoom}>
          <Button
            className={classes.btn}
            disabled={state.disabledDown || !state.ready}
            onClick={handleZoom('down')}
          >
            <ZoomOutIcon />
          </Button>
          <Button
            className={classes.btn}
            disabled={state.disabledReset || !state.ready}
            onClick={handleZoom('reset')}
          >
            <ZoomResetIcon />
          </Button>
          <Button
            className={classes.btn}
            disabled={state.disabledUp || !state.ready}
            onClick={handleZoom('up')}
          >
            <ZoomInIcon />
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

ImageZoom.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(ImageZoom);
