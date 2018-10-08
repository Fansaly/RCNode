const defaultState = {
  time: 0,
  cardPreview: false,
};

let initialState = JSON.parse(localStorage.getItem('SETTINGS'));
initialState = Boolean(initialState) ? initialState : defaultState;

const settings = (state = initialState, { type, data }) => {
  switch (type) {
    case 'UPDATE_SETTINGS':
      localStorage.setItem('SETTINGS', JSON.stringify({
        ...data,
      }));
      return { ...data };
    case 'RESTORE_SETTINGS':
      localStorage.setItem('SETTINGS', JSON.stringify({
        ...defaultState,
      }));
      return defaultState;
    default:
      return state;
  }
};

export default settings;
