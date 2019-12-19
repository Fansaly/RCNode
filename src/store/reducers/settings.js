const defaultState = {
  autoFollow: true,
  themeMode: 'light',
  cardPreview: false,
  time: 0,
};

let initialState = JSON.parse(localStorage.getItem('SETTINGS')) || {};

const {
  autoFollow = true,
  themeMode = 'light',
  cardPreview = false,
  time = 0,
} = initialState;

initialState = {
  autoFollow,
  themeMode,
  cardPreview,
  time,
};

const settings = (state = initialState, { type, data }) => {
  switch (type) {
    case 'UPDATE_SETTINGS':
      localStorage.setItem('SETTINGS', JSON.stringify({
        ...data,
      }));
      return { ...data };
    case 'RESTORE_SETTINGS':
      localStorage.removeItem('SETTINGS');
      return defaultState;
    default:
      return state;
  }
};

export default settings;
