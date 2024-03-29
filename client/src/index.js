import React from 'react';
import ReactDOM from 'react-dom';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './components/serviceWorker';

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();
