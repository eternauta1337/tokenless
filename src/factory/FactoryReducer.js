import {
  CONNECT_FACTORY,
  GET_MARKET_PREVIEW
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  previews: {} // mapping address => preview
};

export default function(state = initialState, action) {
  // console.log('FactoryReducer', action);

  switch(action.type) {

  case CONNECT_FACTORY:
    const factory = action.payload;
    return {
      ...state,
      ...factory,
      isConnected: true
    };

  case GET_MARKET_PREVIEW:
    const market = action.payload;
    return {
      ...state,
      previews: {
        ...state.previews,
        [market.address]: market
      }
    };

  default:
    return state;
  }
}
