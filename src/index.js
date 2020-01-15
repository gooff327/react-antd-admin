import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import reducers from './reducers'
import {generateRoutes} from './actions'
import {
    HashRouter as Router,
    Switch,
  } from "react-router-dom";
import 'antd/dist/antd.css';
const store = createStore(reducers);
store.dispatch(generateRoutes());
const routes = store.getState().routes;

ReactDOM.render(<Router><Switch><App>{routes}</App></Switch></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
