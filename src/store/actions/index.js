export const updateAuth = data => ({
  type: 'UPDATE_AUTH',
  data,
});

export const deleteAuth = () => ({
  type: 'DELETE_AUTH',
});

export const openEditor = data => ({
  type: 'OPEN_EDITOR',
  data,
});

export const closeEditor = data => ({
  type: 'CLOSE_EDITOR',
  data,
});

export const openShare = data => ({
  type: 'OPEN_SHARE',
  data,
});

export const closeShare = () => ({
  type: 'CLOSE_SHARE',
});

export const openZoom = data => ({
  type: 'OPEN_ZOOM',
  data,
});

export const closeZoom = () => ({
  type: 'CLOSE_ZOOM',
});

export const openNotification = data => ({
  type: 'OPEN_NOTIFICATION',
  data,
});

export const closeNotification = () => ({
  type: 'CLOSE_NOTIFICATION',
});

export const updateSettings = data => ({
  type: 'UPDATE_SETTINGS',
  data,
});

export const restoreSettings = data => ({
  type: 'RESTORE_SETTINGS',
  data,
});
