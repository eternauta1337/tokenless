import _ from 'lodash';
import {
  CONNECT_FACTORY,
  GET_MARKET_PREVIEW,
  MARKET_FORGOTTEN,
  FORGET_PREVIEW,
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  previews: {} // mapping address => preview
};

export default function(state = initialState, action) {
  console.log('FactoryReducer', state, action);

  let newState;

  switch(action.type) {

  case CONNECT_FACTORY:
    const factory = action.payload;
    newState = {
      ...state,
      ...factory,
      isConnected: true
    };
    break;

  case GET_MARKET_PREVIEW:
    const market = action.payload;
    newState = {
      ...state,
      previews: {
        ...state.previews,
        [market.address]: market
      }
    };
    break;

  case FORGET_PREVIEW:
    const address = action.payload;
    newState = {
      ...state,
      previews: _.omit(state.previews, address)
    };
    break;

  case MARKET_FORGOTTEN:
    const forgottenAddress = action.payload;
    const newPreviews = _.omit(state.previews, forgottenAddress);
    newState = {
      ...state,
      previews: newPreviews
    };
    break;

  default:
    newState = state;
    break;
  }

  console.log('newState:', newState);

  return newState;
}
