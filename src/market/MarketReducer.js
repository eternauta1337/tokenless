import _ from 'lodash';
import {
  CONNECT_MARKET,
  GET_PREDICTION_PREVIEW,
  PREDICTION_FORGOTTEN,
  FORGET_PREVIEW,
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false,
  previews: {} // mapping address => preview
};

export default function(state = initialState, action) {
  // console.log('MarketReducer', state, action);

  let newState;

  switch(action.type) {

  case CONNECT_MARKET:
    const market = action.payload;
    newState = {
      ...state,
      ...market,
      isConnected: true
    };
    break;

  case GET_PREDICTION_PREVIEW:
    const preview = action.payload;
    newState = {
      ...state,
      previews: {
        ...state.previews,
        [preview.address]: preview
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

  case PREDICTION_FORGOTTEN:
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

  // console.log('newState:', newState);

  return newState;
}
