import ZoomInIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutIcon from '@mui/icons-material/Remove';
import ZoomResetIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

import ShareDialog from '@/components/ShareDialog';
import { useBreakpoints } from '@/hooks';

import defaultState, { Action, State } from './options';

const useStyles = makeStyles((theme) => ({
  fill: {
    flex: 1,
  },
  backdrop: {
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.92)',
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
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#212121',
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
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#212121',
    boxShadow: '0 0 2px rgba(0,0,0,.1), 0 2px 5px rgba(0,0,0,.16)',
    zIndex: 1,
  },
  btn: {
    padding: 10,
    minWidth: 44,
    borderRadius: 0,
  },
}));

interface Props {
  open: boolean;
  url: string;
  onClose?: () => void;
}

const ImageZoom = ({ open, url, onClose }: Props) => {
  const classes = useStyles();
  const isWidthDownSm = useBreakpoints('down', 'sm');

  const dragIsActive = React.useRef<boolean>();
  const zoomWrapRef = React.useRef<null | HTMLDivElement>(null);
  const zoomBoxRef = React.useRef<null | HTMLDivElement>(null);
  const zoomRef = React.useRef<null | HTMLImageElement>(null);

  const [state, setState] = React.useState<State>(defaultState);
  const [share, setShare] = React.useState<RCNode.Share>({ open: false, url: '' });

  const handleOpenShare = () => {
    if (zoomRef.current) {
      const url = zoomRef.current.src;
      setShare((prevState) => ({ ...prevState, open: true, url }));
    }
  };

  const handleCloseShare = () => {
    setShare((prevState) => ({ ...prevState, open: false }));
  };

  const handleClick = ({ target }: React.MouseEvent) => {
    if (!state.ready || target === zoomWrapRef.current || target === zoomBoxRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const setViewport = () => {
    const viewport = document.head.querySelector('meta[name="viewport"]');

    if (!(viewport instanceof HTMLMetaElement)) {
      return;
    }

    const content = viewport.content;
    const scalable = 'user-scalable=no';

    if (/user-scalable=['\w]+/.test(content)) {
      viewport.content = content.replace(/user-scalable=['\w]+/g, scalable);
    } else {
      viewport.content = `${content}, ${scalable}`;
    }

    setState((prevState) => ({
      ...prevState,
      viewport,
      content,
    }));
  };

  const resetViewport = () => {
    const { viewport, content } = state;
    if (viewport && content) {
      viewport.content = content;
    }
  };

  const zoomExit = () => {
    resetViewport();
    setState(defaultState);
  };

  const zoomInit = () => {
    if (!zoomRef.current) {
      return;
    } else if (zoomRef.current.complete) {
      initState();
    } else {
      zoomRef.current.addEventListener('load', initState, false);
    }
  };

  const initState = () => {
    if (!zoomWrapRef.current || !zoomRef.current) {
      return;
    }

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

    const initialWidth = (naturalWidth * initialHeight) / naturalHeight;

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

    const getDragThreshold = (options: State) => {
      const {
        scale,
        wrapWidth = 0,
        wrapHeight = 0,
        maxWidth = 0,
        maxHeight = 0,
        initialWidth = 0,
        initialHeight = 0,
      } = options;
      const { dragSpacings } = defaultState;

      const currentWidth = initialWidth * scale;
      const currentHeight = initialHeight * scale;

      const tX =
        currentWidth > maxWidth
          ? Math.max(0, (currentWidth - wrapWidth) / 2 + dragSpacings)
          : 0;
      const tY =
        currentHeight > maxHeight
          ? Math.max(0, (currentHeight - wrapHeight) / 2 + dragSpacings)
          : 0;

      return { tX, tY };
    };

    const getTransformPos = (options: State) => {
      const { iX, iY, sX, sY, mX, mY } = options;
      const { tX, tY } = getDragThreshold(options);

      let x, y;

      x = iX + mX - sX;
      y = iY + mY - sY;

      x = Math.min(tX, Math.max(-tX, x));
      y = Math.min(tY, Math.max(-tY, y));

      return { x, y };
    };

    const getEventPos = (event: TouchEvent | MouseEvent) => {
      const x = isTouch
        ? (event as TouchEvent).touches[0].pageX
        : (event as MouseEvent).clientX;
      const y = isTouch
        ? (event as TouchEvent).touches[0].pageY
        : (event as MouseEvent).clientY;

      return { x, y };
    };

    const dragStart = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();

      if (!state.dragEnabled) {
        return;
      }

      const { x, y } = getEventPos(event);

      setState((prevState) => ({
        ...prevState,
        sX: x,
        sY: y,
        dragActive: true,
      }));
    };

    const dragMove = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();

      if (!dragIsActive.current) {
        return;
      }

      const { x: mX, y: mY } = getEventPos(event);

      setState((prevState) => {
        const { x, y } = getTransformPos({ ...prevState, mX, mY });
        return { ...prevState, x, y, mX, mY };
      });
    };

    const dragEnd = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();

      if (!dragIsActive.current) {
        return;
      }

      setState((prevState) => ({
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

      if (zoomRef.current) {
        zoomRef.current.addEventListener(eStart, dragStart, false);
        zoomRef.current.addEventListener(eMove, dragMove, false);
        zoomRef.current.addEventListener(eEnd, dragEnd, false);
        zoomRef.current.addEventListener(eCancel, dragEnd, false);
      }
    };

    bindEvents();
    setViewport();
  }, [state.isTouch, state.dragEnabled]);

  React.useEffect(() => {
    dragIsActive.current = state.dragActive;
  }, [state.dragActive]);

  const handleZoom = (action: Action) => () => {
    const { scaleLevels } = state;
    let { scaleLevel } = state;

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

    scaleLevel = Math.min(Math.max(scaleLevel, minScaleLevel), maxScaleLevel);

    const scale = scaleLevels[scaleLevel];
    const disabledUp = scaleLevel === maxScaleLevel;
    const disabledDown = scaleLevel === minScaleLevel;
    const disabledReset = scaleLevel === baseScaleLevel;

    setState((prevState) => ({
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
    const maxWidth = state.maxWidth || 0;
    const maxHeight = state.maxHeight || 0;
    const initialWidth = state.initialWidth || 0;
    const initialHeight = state.initialHeight || 0;

    const currentWidth = initialWidth * scale;
    const currentHeight = initialHeight * scale;

    const dragEnabled = currentWidth > maxWidth || currentHeight > maxHeight;

    setState((prevState) => ({
      ...prevState,
      dragEnabled,
    }));
  }, [
    // observed deps
    state.scale,
    // other deps
    state.ready,
    state.maxWidth,
    state.maxHeight,
    state.initialWidth,
    state.initialHeight,
  ]);

  // update transform style
  React.useEffect(() => {
    if (!zoomRef.current) {
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
      keepMounted={isWidthDownSm}
      TransitionProps={{
        onEnter: zoomInit,
        onExited: zoomExit,
      }}
      BackdropProps={{ className: classes.backdrop }}
      PaperProps={{ className: classes.container }}
      onClose={handleClose}
    >
      <Grid className={classes.actions}>
        <Grid className={classes.fill}>
          <IconButton size="large" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <IconButton size="large" disabled={!state.ready} onClick={handleOpenShare}>
          <ShareIcon />
        </IconButton>
      </Grid>
      <DialogContent className={classes.content}>
        <div
          ref={zoomWrapRef}
          className={classes.wrap}
          role="grid"
          tabIndex={-1}
          onKeyUp={() => null}
          onClick={handleClick}
        >
          <Fade in={!state.ready} className={classes.loading}>
            <CircularProgress />
          </Fade>
          <div
            ref={zoomBoxRef}
            className={clsx(classes.box, {
              ready: state.ready,
            })}
          >
            <img
              ref={zoomRef}
              className={clsx(classes.target, {
                'drag-enabled': state.dragEnabled,
                'drag-active': state.dragActive,
              })}
              style={{ height: state.initialHeight || 'auto' }}
              src={url}
              alt="zoom"
            />
          </div>
        </div>
        <Grid className={classes.zoom}>
          <Button
            className={classes.btn}
            color="inherit"
            disabled={state.disabledDown || !state.ready}
            onClick={handleZoom('down')}
          >
            <ZoomOutIcon />
          </Button>
          <Button
            className={classes.btn}
            color="inherit"
            disabled={state.disabledReset || !state.ready}
            onClick={handleZoom('reset')}
          >
            <ZoomResetIcon />
          </Button>
          <Button
            className={classes.btn}
            color="inherit"
            disabled={state.disabledUp || !state.ready}
            onClick={handleZoom('up')}
          >
            <ZoomInIcon />
          </Button>
        </Grid>
      </DialogContent>

      <ShareDialog {...share} onClose={handleCloseShare} />
    </Dialog>
  );
};

export default ImageZoom;
