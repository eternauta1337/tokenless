import {
  START_WEB3,
  SET_ACTIVE_ACCOUNT_INDEX
} from '../actions/network';

const initialState = {
  isConnected: false,
  web3: undefined,
  activeAccountIndex: undefined,
  activeAccount: undefined
};

export default function(state = initialState, action) {
  console.log('NetworkReducer', action);

  switch(action.type) {

  case START_WEB3:
    return {
      ...state,
      web3: action.payload,
      isConnected: true
    };

  case SET_ACTIVE_ACCOUNT_INDEX:
    return {
      ...state,
      activeAccountIndex: action.payload,
      activeAccount: state.web3.eth.accounts[action.payload]
    };

  default:
    return state;
  }
}
