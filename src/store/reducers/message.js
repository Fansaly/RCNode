const initialState = {
  count: 0,
};

const message = (state = initialState, { type, data }) => {
  switch (type) {
    case 'READ_MESSAGE':
      let { count } = state;
      count = Math.max(--count, 0);
      return { count };
    case 'READ_ALL_MESSAGE':
      return initialState;
    case 'UPDATE_MESSAGE':
      return { count: data };
    case 'CLEAN_MESSAGE':
      return initialState;
    default:
      return state;
  }
};

export default message;
