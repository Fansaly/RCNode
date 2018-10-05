const initialState = {
  url: '',
  open: false,
};

const share = (state = initialState, { type, data }) => {
  switch (type) {
    case 'OPEN_SHARE':
      if (typeof data === 'string') {
        data = {
          url: data,
          post: null,
        };
      }
      return {
        ...data,
        open: true,
      };
    case 'CLOSE_SHARE':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default share;
