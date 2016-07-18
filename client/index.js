//import 'babel-polyfill' // is this needed? look into what it does
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore'
import createBrowserHistory from 'history/lib/createBrowserHistory';

const history = createBrowserHistory();
const preloadedState = window.__PRELOADED_STATE__
const store = configureStore(preloadedState)
const app = document.getElementById('app');
const appBase = (
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>
);

render(appBase, app);
