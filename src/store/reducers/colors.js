const initialState = JSON.parse(localStorage.getItem('THEME'));

const colors = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_COLORS':
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

export default colors;
