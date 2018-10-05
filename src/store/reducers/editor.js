const initialState = {
  open: false,
};

const editor = (state = initialState, { type, data }) => {
  switch (type) {
    case 'OPEN_EDITOR':
      const { action, ...other } = data;
      return {
        open: true,
        action: action || 'create',
        ...other,
      };
    case 'CLOSE_EDITOR':
      return {
        ...data,
        open: false,
      };
    default:
      return state;
  }
};

export default editor;
