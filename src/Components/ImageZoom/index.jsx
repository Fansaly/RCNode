import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  closeZoom,
  openShare,
} from '../../store/actions';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import ZoomInIcon from '@material-ui/icons/Add';
import ZoomOutIcon from '@material-ui/icons/Remove';
import ZoomResetIcon from '@material-ui/icons/Search';

const styles = theme => ({
  fill: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(255,255,255,.85)',
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    boxShadow: '0 0 2px rgba(0,0,0,.1), 0 2px 5px rgba(0,0,0,.16)',
    zIndex: 1,
  },
  btn: {
    padding: 10,
    minWidth: 44,
    borderRadius: 0,
  },
});

const defaultState = {
  // translate position
  x: 0,
  y: 0,
  // drag start position
  sX: 0,
  sY: 0,
  // drag move position
  mX: 0,
  mY: 0,
  scale: 1,
  scaleLevel: 1,
  scaleLevels: [ .68, 1, 1.38, 2, 3.21, 4.96 ],
  spacings: 16,
  dragSpacings: 50,
  disabledUp: false,
  disabledDown: false,
  disabledReset: true,
  dragEnabled: false,
  dragActive: false,
  // image loaded
  ready: false,
};

class ImageZoom extends React.Component {
  state = defaultState;

  handleClick = event => {
    const { target } = event;
    const { ready } = this.state;

    if (!ready || target === this.wrap || target === this.box) {
      this.handleClose();
    }
  };

  handleShare = () => {
    const url = this.zoomTarget.src;
    this.props.openShare(url);
  };

  handlePreClose = () => {
    const { open } = this.props;
    open && this.handleClose();
  };

  handleClose = () => {
    this.props.closeZoom();
  };

  resetState = () => {
    this.setState({ ...defaultState });
  };

  getDragThreshold = () => {
    const {
      scale,
      dragSpacings,
      initialWidth,
      initialHeight,
      wrapWidth,
      wrapHeight,
      maxWidth,
      maxHeight,
    } = this.state;

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

  getTransform = () => {
    let {
      x,
      y,
      sX,
      sY,
      mX,
      mY,
    } = this.state;

    const { tX, tY } = this.getDragThreshold();

    x += mX - sX;
    y += mY - sY;

    x = Math.min(tX, Math.max(-tX, x));
    y = Math.min(tY, Math.max(-tY, y));

    return { x, y };
  };

  updateTransform = () => {
    const { scale } = this.state;
    const { x, y } = this.getTransform();
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    this.zoomTarget.style.transform = transform;
  };

  resetTransform = () => {
    const { x, y, scale } = defaultState;
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    this.zoomTarget.style.transform = transform;
  };

  updateDragStatus = () => {
    const {
      scale,
      initialWidth,
      initialHeight,
      maxWidth,
      maxHeight,
    } = this.state;

    const currentWidth = initialWidth * scale;
    const currentHeight = initialHeight * scale;

    const dragEnabled = currentWidth > maxWidth || currentHeight > maxHeight;

    this.setState({ dragEnabled });
  };

  getEventPosition = event => {
    const { isTouch } = this.state;
    const x = isTouch ? event.touches[0].pageX : event.clientX;
    const y = isTouch ? event.touches[0].pageY : event.clientY;

    return { x, y };
  };

  dragStart = event => {
    event.preventDefault();

    if (!this.state.dragEnabled) { return; }

    const { x, y } = this.getEventPosition(event);

    this.setState({
      sX: x,
      sY: y,
      mX: x,
      mY: y,
      dragActive: true,
    });
  };

  dragActive = event => {
    event.preventDefault();

    if (!this.state.dragActive) { return; }

    const { x, y } = this.getEventPosition(event);

    this.setState({
      mX: x,
      mY: y,
    }, () => {
      this.updateTransform();
    });
  };

  dragEnd = event => {
    event.preventDefault();

    if (!this.state.dragActive) { return; }

    const { x, y } = this.getTransform();

    this.setState({
      x,
      y,
      dragActive: false,
    });
  };

  bindEvents = () => {
    const { isTouch } = this.state;

    const eStart = isTouch ? 'touchstart' : 'mousedown';
    const eMove = isTouch ? 'touchmove' : 'mousemove';
    const eEnd = isTouch ? 'touchend' : 'mouseup';
    const eCancel = isTouch ? 'touchcancel' : 'mouseleave';

    this.zoomTarget.addEventListener(eStart, this.dragStart);
    this.zoomTarget.addEventListener(eMove, this.dragActive);
    this.zoomTarget.addEventListener(eEnd, this.dragEnd);
    this.zoomTarget.addEventListener(eCancel, this.dragEnd);
  };

  setViewport = () => {
    const viewport = document.head.querySelector('meta[name="viewport"]');
    const content = viewport.content;
    const scalable = 'user-scalable=no';

    viewport.content = `${content}, ${scalable}`;

    this.setState({
      viewport,
      content,
    });
  };

  resetViewport = () => {
    const { viewport, content } = this.state;
    viewport && (viewport.content = content);
  };

  initState = () => {
    const isTouch = 'ontouchstart' in window;

    const { spacings } = defaultState;
    const { naturalWidth, naturalHeight } = this.zoomTarget;

    const wrapWidth = this.wrap.clientWidth;
    const wrapHeight = this.wrap.clientHeight;

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

    this.setState({
      ...defaultState,
      initialWidth,
      initialHeight,
      naturalWidth,
      naturalHeight,
      wrapWidth,
      wrapHeight,
      maxWidth,
      maxHeight,
      isTouch,
      ready: true,
    }, () => {
      this.setViewport();
      this.bindEvents();
    });
  };

  zoomInit = () => {
    if (this.zoomTarget.complete) {
      this.initState();
    } else {
      this.zoomTarget.addEventListener('load', this.initState);
    }
  };

  zoomExit = () => {
    this.resetState();
    this.resetViewport();
    this.resetTransform();
  };

  handleZoom = action => event => {
    let {
      scale,
      scaleLevel,
      scaleLevels,
      disabledUp,
      disabledDown,
      disabledReset,
    } = this.state;

    const baseScaleLevel = 1;
    const minScaleLevel = 0;
    const maxScaleLevel = scaleLevels.length - 1;

    switch (action) {
      case 'init':
        this.zoomInit();
        return;
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
        this.zoomExit();
        return;
    }

    scaleLevel = Math.min(
      Math.max(scaleLevel, minScaleLevel),
      maxScaleLevel
    );

    scale = scaleLevels[scaleLevel];
    disabledUp = scaleLevel === maxScaleLevel;
    disabledDown = scaleLevel === minScaleLevel;
    disabledReset = scaleLevel === baseScaleLevel;

    this.setState(state => ({
      ...defaultState,
      scale,
      scaleLevel,
      disabledUp,
      disabledDown,
      disabledReset,
      ready: state.ready,
    }), () => {
      this.updateDragStatus();
      this.updateTransform();
    });
  };

  componentWillUnmount() {
    this.handlePreClose();
  }

  render() {
    const {
      classes,
      width,
      open,
      src,
    } = this.props;

    const {
      initialHeight = 'auto',
      disabledUp,
      disabledDown,
      disabledReset,
      dragEnabled,
      dragActive,
      ready,
    } = this.state;

    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth={false}
        onClose={this.handleClose}
        onEnter={this.handleZoom('init')}
        onExited={this.handleZoom('exit')}
        BackdropProps={{ className: classes.backdrop }}
        PaperProps={{ className: classes.container }}
        keepMounted={isWidthDown('xs', width)}
      >
        <Grid className={classes.actions}>
          <Grid className={classes.fill}>
            <IconButton
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <IconButton
            className={classes.share}
            onClick={this.handleShare}
            disabled={!ready}
          >
            <ShareIcon />
          </IconButton>
        </Grid>
        <DialogContent className={classes.content}>
          <div
            ref={ref => this.wrap = ref}
            className={classes.wrap}
            onClick={this.handleClick}
            onKeyUp={() => {}}
            role="grid"
            tabIndex="-1"
          >
            <Fade
              in={!ready}
              className={classes.loading}
            >
              <CircularProgress />
            </Fade>
            <div
              ref={ref => this.box = ref}
              className={classNames(classes.box, {
                'ready': ready,
              })}
            >
              <img
                ref={ref => this.zoomTarget = ref}
                className={classNames(classes.target, {
                  'drag-enabled': dragEnabled,
                  'drag-active': dragActive,
                })}
                style={{ height: initialHeight }}
                src={src}
                alt="zoom"
              />
            </div>
          </div>
          <Grid className={classes.zoom}>
            <Button
              className={classes.btn}
              disabled={disabledDown || !ready}
              onClick={this.handleZoom('down')}
            >
              <ZoomOutIcon />
            </Button>
            <Button
              className={classes.btn}
              disabled={disabledReset || !ready}
              onClick={this.handleZoom('reset')}
            >
              <ZoomResetIcon />
            </Button>
            <Button
              className={classes.btn}
              disabled={disabledUp || !ready}
              onClick={this.handleZoom('up')}
            >
              <ZoomInIcon />
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

ImageZoom.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  src: PropTypes.string,
};

const mapStateToProps = ({ zoom }) => ({
  ...zoom,
});

const mapDispatchToProps = dispatch => ({
  closeZoom: () => {
    dispatch(closeZoom());
  },
  openShare: url => {
    dispatch(openShare(url));
  },
});

export default compose(
  withStyles(styles),
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ImageZoom);
