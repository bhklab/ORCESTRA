import React from 'react';
import '../css/Navigation.css';

const Navigation = () => (
    <header>
        <span className="home-button">
            <img src="./images/trumpet-orcestra.png" alt='' />
            ORCESTRA
        </span>
        <a href="https://pharmacodb.pmgenomics.ca" target="_blank">PharmacoDB</a>
        <a href="https://www.pmgenomics.ca/bhklab/" target="_blank">Contact</a>
        <a href="http://localhost:3000/" >Home</a>
    </header>
);

export default Navigation;