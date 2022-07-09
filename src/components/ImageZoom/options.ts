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
  scaleLevels: [0.68, 1, 1.38, 2, 3.21, 4.96],
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
  ready: false,
};

export default defaultState;

export type State = typeof defaultState & {
  isTouch?: boolean;

  wrapWidth?: number;
  wrapHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  initialWidth?: number;
  initialHeight?: number;

  viewport?: HTMLMetaElement;
  content?: string;
};

export type Action = 'up' | 'down' | 'reset';
