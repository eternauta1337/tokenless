import store from './main/store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, IndexRoute } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppComponent from './main/components/AppComponent';
import HomeComponent from './home/components/HomeComponent';
import MarketComponent from './market/containers/MarketComponent';
import CreateMarketComponent from './factory/containers/CreateMarketComponent';
import ListMarketsComponent from './factory/containers/ListMarketsComponent';
import {
  PATH_MARKET,
  PATH_LIST,
  PATH_CREATE
} from './constants';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

// UI entry point and routes.
ReactDOM.render((
    <Provider store={store}>
      <Router history={syncHistoryWithStore(browserHistory, store)}>
        <Route path="/" component={AppComponent}>
          <IndexRoute component={HomeComponent}/>
          <Route path={PATH_LIST} component={ListMarketsComponent}/>
          <Route path={PATH_CREATE} component={CreateMarketComponent}/>
          <Route path={PATH_MARKET} component={MarketComponent}/>
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
