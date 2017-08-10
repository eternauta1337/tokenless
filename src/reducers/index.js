import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import NetworkReducer from './NetworkReducer';
import MarketReducer from './MarketReducer';

const reducer = combineReducers({
  routing: routerReducer,
  network: NetworkReducer,
  market: MarketReducer
});

export default reducer;
