import store from './common/store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, IndexRoute } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppComponent from './AppComponent';
import HomeComponent from './home/components/HomeComponent';
import MarketComponent from './market/components/MarketComponent';
import CreateMarketComponent from './factory/components/CreateMarketComponent';
import ListMarketsComponent from './factory/components/ListMarketsComponent';
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
