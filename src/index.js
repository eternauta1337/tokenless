// Reducers.
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import NetworkReducer from './network/NetworkReducer';
import MarketReducer from './market/MarketReducer';
import FactoryReducer from './factory/FactoryReducer';
const reducer = combineReducers({
  routing: routerReducer,
  network: NetworkReducer,
  factory: FactoryReducer,
  market: MarketReducer
});

// Redux Store.
import { syncHistoryWithStore } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const routingMiddleware = routerMiddleware(browserHistory);
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routingMiddleware
    )
  )
);
const history = syncHistoryWithStore(browserHistory, store);

// UI Entry point.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppComponent from './components/AppComponent';
import HomeComponent from './components/home/HomeComponent';
import MarketComponent from './market/components/MarketComponent';
import CreateMarketComponent from './factory/components/CreateMarketComponent';
import './styles/index.css';
ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={AppComponent}>
          <IndexRoute component={HomeComponent}/>
          <Route path="market/:address" component={MarketComponent}/>
          <Route path="create" component={CreateMarketComponent}/>
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);

// Initialize web3 and store in state.
import {
  startWeb3
} from './network/actions';
store.dispatch(startWeb3());
