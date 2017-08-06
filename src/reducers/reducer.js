import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import web3Reducer from '../util/web3/web3Reducer';
import MarketsReducer from './MarketsReducer';

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  markets: MarketsReducer
});

export default reducer;
