import {
  LOAD_MARKET
} from '../actions/MarketActions';

export default function(state = {}, action) {
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
