/**
 * auth
 * ------------
 * UPDATE_AUTH
 * DELETE_AUTH
 */
export const updateAuth = data => ({
  type: 'UPDATE_AUTH',
  data,
});

export const deleteAuth = () => ({
  type: 'DELETE_AUTH',
});


/**
 * message
 * ------------
 * READ_MESSAGE
 * READ_ALL_MESSAGE
 * UPDATE_MESSAGE
 * CLEAN_MESSAGE
 */
export const readMessage = () => ({
  type: 'READ_MESSAGE',
});

export const readAllMessage = () => ({
  type: 'READ_ALL_MESSAGE',
});

export const updateMessage = data => ({
  type: 'UPDATE_MESSAGE',
  data,
});

export const cleanMessage = () => ({
  type: 'CLEAN_MESSAGE',
});


/**
 * message
 * ------------
 * OPEN_EDITOR
 * CLOSE_EDITOR
 */
export const openEditor = data => ({
  type: 'OPEN_EDITOR',
  data,
});

export const closeEditor = data => ({
  type: 'CLOSE_EDITOR',
  data,
});


/**
 * share
 * -----------
 * OPEN_SHARE
 * CLOSE_SHARE
 */
export const openShare = data => ({
  type: 'OPEN_SHARE',
  data,
});

export const closeShare = () => ({
  type: 'CLOSE_SHARE',
});


/**
 * zoom
 * ----------
 * OPEN_ZOOM
 * CLOSE_ZOOM
 */
export const openZoom = data => ({
  type: 'OPEN_ZOOM',
  data,
});

export const closeZoom = () => ({
  type: 'CLOSE_ZOOM',
});


/**
 * notification
 * ------------------
 * OPEN_NOTIFICATION
 * CLOSE_NOTIFICATION
 */
export const openNotification = data => ({
  type: 'OPEN_NOTIFICATION',
  data,
});

export const closeNotification = () => ({
  type: 'CLOSE_NOTIFICATION',
});


/**
 * settings
 * ----------------
 * UPDATE_SETTINGS
 * RESTORE_SETTINGS
 */
export const updateSettings = data => ({
  type: 'UPDATE_SETTINGS',
  data,
});

export const restoreSettings = data => ({
  type: 'RESTORE_SETTINGS',
  data,
});
