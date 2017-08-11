import {
  CONNECT_FACTORY
} from './actions';

const initialState = {
  factoryContract: undefined
};

export default function(state = initialState, action) {
  // console.log('FactoryReducer', action);

  switch(action.type) {

  case CONNECT_FACTORY:
    return {
      ...state,
      factoryContract: action.payload
    };

  default:
    return state;
  }
}
