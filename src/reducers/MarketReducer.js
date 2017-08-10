import {
  CONNECT_MARKET
} from '../actions/market';

const initialState = {
  marketContract: undefined,
  isConnected: false
};

export default function(state = initialState, action) {
  console.log('MarketReducer', action);

  switch(action.type) {

  case CONNECT_MARKET:
    return {
      ...state,
      marketContract: action.payload,
      isConnected: true
    };

  default:
    return state;
  }
}
