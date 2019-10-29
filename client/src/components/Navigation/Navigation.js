import React from 'react';
import './Navigation.css';

const Navigation = () => (
    <header>
        <a href='/'><img src="./images/trumpet-orcestra.png" alt='' /></a>
        <div className='navBar'>
            <div><a href="https://pharmacodb.pmgenomics.ca" target="_blank">PharmacoDB</a></div>
            <div><a href="https://www.pmgenomics.ca/bhklab/" target="_blank">Contact</a></div>
            <div><a href="http://localhost:3000/" >Home</a></div>
        </div>
    </header>
);

export default Navigation;