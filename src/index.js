import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import reducers from './reducers'
// import {generateRoutes} from './actions'
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import 'antd/dist/antd.css';
const store = createStore(reducers);
const routes = store.getState().base;
ReactDOM.render(<Router><App><Switch>{routes.map((route, i) => <RouteWithSubRoutes key={i} {...route}/>)}</Switch></App></Router>, document.getElementById('root'));

function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                <route.component {...props} meta={route.meta} />
            )}
        />
    );
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
