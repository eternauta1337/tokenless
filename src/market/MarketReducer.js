import {
  CONNECT_MARKET
} from './actions';

const initialState = {
  marketContract: undefined,
  isConnected: false,
  statement: undefined
  /* additional market params */
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

  default:
    return state;
  }
}
