const initialState = {
  message: '',
  status: 'success',
  open: false,
};

const notification = (state = initialState, { type, data }) => {
  switch (type) {
    case 'OPEN_NOTIFICATION':
      if (typeof data === 'string') {
        data = {
          message: data,
          status: 'success',
        };
      }
      return {
        ...data,
        open: true,
      };
    case 'CLOSE_NOTIFICATION':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default notification;
