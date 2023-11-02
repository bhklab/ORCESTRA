import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './components/serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root.
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

serviceWorker.unregister();
