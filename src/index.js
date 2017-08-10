// Redux Store
import { syncHistoryWithStore } from 'react-router-redux';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const routingMiddleware = routerMiddleware(browserHistory);
const store = createStore(
  reducers,
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
import MarketContainer from './components/market/MarketContainer';
import './styles/index.css';
ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={AppComponent}>
          <IndexRoute component={HomeComponent}/>
          <Route path="market/:address" component={MarketContainer}/>
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);

// Initialize web3 and store in state.
import {
  startWeb3
} from './actions/network';
store.dispatch(startWeb3());
