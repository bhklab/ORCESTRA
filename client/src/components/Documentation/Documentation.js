import React, { useState } from 'react';
import './Documentation.css';

import Overview from './DocFunctionality/Overview';
import Search from './DocFunctionality/Search';
import Request from './DocFunctionality/Request';
import UserProfile from './DocFunctionality/UserProfile';
import DataContribution from './DocFunctionality/DataContribution';
import AvailablePSets from './DocAPI/AvailablePSets';
import PSetMetadata from './DocAPI/PSetMetadata';
import StatisticsAPI from './DocAPI/StatisticsAPI';

const Documentation = (props) => {
    
    const [display, setDisplay] = useState(props.match.params.section);

    return(
        <div className='pageContent'>
            <div className='documentationContent'>
                <nav className='documentationNav'>
                    <h3>Functionality</h3>
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
                            <button type='button' onClick={() => setDisplay('userProfile')}>Profile/Statistics</button>
                        </li>
                    </ul> 
                    <h3>Support</h3>
                    <ul>
                        <li className={display === 'datacontribution' ? 'selected' : undefined}>
                            <button type='button' onClick={() => setDisplay('datacontribution')}>Contributing Your Data</button>
                        </li>   
                    </ul>
                    <h3>API</h3>
                    <ul>
                        <li className={display === 'api-psets-available' ? 'selected' : undefined}>
                            <button type='button' onClick={() => setDisplay('api-psets-available')}>Available Datasets</button>
                        </li>
                        <li className={display === 'api-pset-single' ? 'selected' : undefined}>
                            <button type='button' onClick={() => setDisplay('api-pset-single')} >Single Dataset</button>
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
                {display === 'datacontribution' && <DataContribution /> }
                {display === 'api-psets-available' && <AvailablePSets /> }
                {display === 'api-pset-single' && <PSetMetadata /> }
                {display === 'api-statistics' && <StatisticsAPI /> }
            </div>
        </div>
    );
}

export default Documentation;