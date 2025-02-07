import '@babel/polyfill';
import 'tslib';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './react-table-dark.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import * as serviceWorker from './serviceWorker';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.unregister();
