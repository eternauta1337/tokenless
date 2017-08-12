import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import NetworkReducer from '../network/NetworkReducer';
import MarketReducer from '../market/MarketReducer';
import FactoryReducer from '../factory/FactoryReducer';

const reducer = combineReducers({
  routing: routerReducer,
  network: NetworkReducer,
  factory: FactoryReducer,
  market: MarketReducer
});

export default reducer;
