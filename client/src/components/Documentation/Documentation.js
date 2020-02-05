import React, { useState } from 'react';
import './Documentation.css';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

import Overview from './DocFunctionality/Overview';
import Search from './DocFunctionality/Search';
import Request from './DocFunctionality/Request';
import UserProfile from './DocFunctionality/UserProfile';
import Statistics from './DocFunctionality/Statistics';

const Documentation = (props) => {
    
    const [display, setDisplay] = useState('overview');

    return(
        <React.Fragment>
            <Navigation routing={props} />
            <div className='pageContent'>
                <div className='documentationContent'>
                    <nav className='documentationNav'>
                        <h2>Functionality</h2>
                        <ul>
                            <li className={display === 'overview' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('overview')}>Overview</button>
                            </li>
                            <li className={display === 'search' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('search')}>Search</button>
                            </li>    
                            <li className={display === 'request' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('request')}>Request</button>
                            </li>
                            <li className={display === 'userProfile' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('userProfile')}>User Profile</button>
                            </li>
                            <li className={display === 'statistics' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('statistics')}>Statistics</button>
                            </li>
                        </ul> 
                        <h2>API</h2>
                        <ul>
                            <li className={display === 'api-psets-available' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('api-psets-available')}>Available PSets</button>
                            </li>
                            <li className={display === 'api-pset-single' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('api-pset-single')} >PSet Metadata</button>
                            </li>
                            <li className={display === 'api-statistics' ? 'selected' : undefined}>
                                <button type='button' onClick={() => setDisplay('api-statistics')}>Statistics</button>
                            </li>    
                        </ul>
                    </nav>
                    {display === 'overview' && <Overview /> }
                    {display === 'search' && <Search /> }
                    {display === 'request' && <Request /> }
                    {display === 'userProfile' && <UserProfile /> }
                    {display === 'statistics' && <Statistics /> }
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}

export default Documentation;