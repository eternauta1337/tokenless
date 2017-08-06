const initialState = {
  instance: null
};

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    return Object.assign({}, state, {
      instance: action.payload.instance
    });
  }

  return state;
};

export default web3Reducer;
