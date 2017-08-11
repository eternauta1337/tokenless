import {
  CONNECT_FACTORY
} from './actions';

const initialState = {
  contract: undefined,
  isConnected: false
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

  default:
    return state;
  }
}
