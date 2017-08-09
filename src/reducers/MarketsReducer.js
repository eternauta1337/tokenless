import {
  LOAD_MARKET
} from '../actions/MarketActions';

const initialState = {
  /* ["0x05d2b3c177c974cb70492b8ad956e1caf64077f7"]: market */
  focusedMarket: undefined,
  nonce: 0
};

export default function(state = initialState, action) {
  console.log('MarketsReducer', action);

  switch(action.type) {

  case LOAD_MARKET:
    var market = action.payload;
    return {
      ...state,
      [market.address]: market,
      focusedMarket: market,
      nonce: state.nonce + 1
    };

  default:
    return state;
  }
}
