import store from './main/store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, IndexRoute } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppComponent from './main/components/AppComponent';
import HomeComponent from './home/components/HomeComponent';
import PredictionComponent from './prediction/containers/PredictionComponent';
import CreatePredictionComponent from './market/containers/CreatePredictionComponent';
import ListPredictionsComponent from './market/containers/ListPredictionsComponent';
import AboutComponent from './about/components/AboutComponent';
import {
  PATH_PREDICTION,
  PATH_LIST,
  PATH_CREATE,
  PATH_ABOUT
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
          <Route path={PATH_LIST} component={ListPredictionsComponent}/>
          <Route path={PATH_CREATE} component={CreatePredictionComponent}/>
          <Route path={PATH_PREDICTION} component={PredictionComponent}/>
          <Route path={PATH_ABOUT} component={AboutComponent}/>
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
