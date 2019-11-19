import React from 'react';
import { NavLink } from 'react-router-dom'
import './Navigation.css';

const Navigation = () => (
    <header>
        <NavLink exact to='/'><img src="./images/trumpet-orcestra.png" alt='' /></NavLink>
        <div className='navBar'>
            <div><NavLink exact to='/' activeClassName='active-link'>Home</NavLink></div>
            <div><NavLink exact to="/PSetList" activeClassName='active-link'>Search</NavLink></div>
            <div><NavLink exact to="/PSetRequest" activeClassName='active-link'>Request</NavLink></div>
            <div><NavLink exact to="/Stats" activeClassName='active-link'>Statistics</NavLink></div>
            <div><NavLink exact to="/Profile" activeClassName='active-link'>Profile</NavLink></div>
            <div><a href="https://pharmacodb.pmgenomics.ca">PharmacoDB</a></div>
            <div><a href="https://www.pmgenomics.ca/bhklab/">Contact</a></div>    
        </div>
    </header>
);

export default Navigation;