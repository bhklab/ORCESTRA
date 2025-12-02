import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/prime-style.css';
import './styles/main.css';
import 'primereact/resources/themes/fluent-light/theme.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </BrowserRouter>
    </React.StrictMode>
);
