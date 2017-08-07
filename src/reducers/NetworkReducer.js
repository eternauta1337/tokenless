import {
  INIT_WEB3
} from '../actions/NetworkActions';

const initialState = {
  web3: undefined
};

export default function(state = initialState, action) {
  // console.log('NetworkReducer', action);

  switch(action.type) {

  case INIT_WEB3:
    return {
      ...state,
      web3: action.payload
    };

  default:
    return state;
  }
}
