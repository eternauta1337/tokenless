import {
  CONNECT_PREDICTION,
  UPDATE_PREDICTION,
  RESET_MARKET
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  /* additional prediction params are decomposed */
};

export default function(state = initialState, action) {
  // console.log('PredictionReducer', action);

  let prediction;

  switch(action.type) {

  case CONNECT_PREDICTION:
    prediction = action.payload;
    return {
      ...state,
      ...prediction,
      isConnected: true
    };

  case UPDATE_PREDICTION:
    prediction = action.payload;
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
