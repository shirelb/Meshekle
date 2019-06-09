import React from 'react';
import * as Sentry from '@sentry/browser';

import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

Sentry.init({dsn: "https://16dd618fe8ab4102bf7fd6929f87434a@sentry.io/1478107"});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
