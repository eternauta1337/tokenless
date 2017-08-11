import {
  START_WEB3,
  SET_ACTIVE_ACCOUNT_INDEX,
  UPDATE_NETWORK
} from './actions';

const initialState = {
  isConnected: false,
  web3: undefined,
  activeAccountIndex: undefined,
  activeAccountAddress: undefined,
  /* additional blockchain params */
};

export default function(state = initialState, action) {
  // console.log('NetworkReducer', action);

  switch(action.type) {

  case START_WEB3:
    return {
      ...state,
      web3: action.payload,
      isConnected: true
    };

  case UPDATE_NETWORK:
    const blockchain = action.payload;
    return {
      ...state,
      ...blockchain
    };

  case SET_ACTIVE_ACCOUNT_INDEX:
    return {
      ...state,
      activeAccountIndex: action.payload,
      activeAccountAddress: state.web3.eth.accounts[action.payload]
    };

  default:
    return state;
  }
}
