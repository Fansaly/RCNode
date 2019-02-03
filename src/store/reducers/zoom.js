const initialState = {
  open: false,
};

const zoom = (state = initialState, { type, data }) => {
  switch (type) {
    case 'OPEN_ZOOM':
      return {
        ...data,
        open: true,
      };
    case 'CLOSE_ZOOM':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default zoom;
