import {
  CONNECT_MARKET,
  RESET_MARKET
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  /* additional prediction params are decomposed */
};

export default function(state = initialState, action) {
  // console.log('PredictionReducer', action);

  switch(action.type) {

  case CONNECT_MARKET:
    const prediction = action.payload;
    return {
      ...state,
      ...prediction,
      isConnected: true
    };

  case RESET_MARKET:
    return initialState;

  default:
    return state;
  }
}
