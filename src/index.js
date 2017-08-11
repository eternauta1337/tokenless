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
import './styles/index.css';

// UI entry point and routes.
ReactDOM.render((
    <Provider store={store}>
      <Router history={syncHistoryWithStore(browserHistory, store)}>
        <Route path="/" component={AppComponent}>
          <IndexRoute component={HomeComponent}/>
          <Route path="/list" component={ListMarketsComponent}/>
          <Route path="/create" component={CreateMarketComponent}/>
          <Route path="/market/:address" component={MarketComponent}/>
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
