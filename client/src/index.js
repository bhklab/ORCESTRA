import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Router from './components/Routing/Router';
import * as serviceWorker from './components/serviceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));

serviceWorker.unregister();
