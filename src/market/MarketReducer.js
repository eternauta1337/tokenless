import {
  CONNECT_MARKET,
  RESET_MARKET
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  /* additional market params are decomposed */
};

export default function(state = initialState, action) {
  // console.log('MarketReducer', action);

  switch(action.type) {

  case CONNECT_MARKET:
    const market = action.payload;
    return {
      ...state,
      ...market,
      isConnected: true
    };

  case RESET_MARKET:
    return initialState;

  default:
    return state;
  }
}
