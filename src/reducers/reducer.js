import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import NetworkReducer from './NetworkReducer';
import MarketsReducer from './MarketsReducer';

const reducer = combineReducers({
  routing: routerReducer,
  network: NetworkReducer,
  markets: MarketsReducer
});

export default reducer;
