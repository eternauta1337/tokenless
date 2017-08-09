import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import {
  loadWeb3Async
} from './actions/NetworkActions';
import './styles/index.css';

// Layouts
import App from './components/App';
import Home from './components/Home';
import MarketContainer from './components/market/MarketContainer';

// Redux Store
import store from './store';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="market/:address" component={MarketContainer}/>
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
);

// Initialize web3 and store in state.
const DEBUG = true;
store.dispatch(loadWeb3Async(DEBUG));
