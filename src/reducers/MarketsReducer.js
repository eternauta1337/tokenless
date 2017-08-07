import {
  LOAD_MARKET
} from '../actions/MarketActions';

const initialState = {
  /* eg:
  ["0x05d2b3c177c974cb70492b8ad956e1caf64077f7"]: market
  */
};

export default function(state = initialState, action) {
  // console.log('MarketsReducer', action);
  switch(action.type) {
  case LOAD_MARKET:
    var market = action.payload;
    return {
      ...state,
      [market.address]: market
    };
  default:
    return state;
  }
}
