import React from 'react';
import './Main.css';

const OrcestraMain = (props) => {
    
    
    
    return (
        <div className='mainContent'>
            <div className="home">
                <h1>ORCESTRA</h1>   
                <h2>Orchestration platform for reproducing pharmacogenomic analyses</h2>
                <div className='mainMenuContainer'>
                    <div className='mainMenuRow'>
                        <div className='mainMenuItem'>
                            <h2>Search and Request PSets</h2>
                            <div className='mainMenuItemContent'>
                                <div>Design your own PSet generation pipeline using:</div>
                                <div className='mainMenuItemLine'><span className='largeNum'>9</span> <span>Datasets.</span></div>
                                <div className='mainMenuItemLine'><span className='largeNum'>6</span> <span>RNA tools.</span></div>
                                <div className='mainMenuItemLine'><span className='largeNum'>2</span> <span>DNA tools.</span></div>
                                <div className='mainMenuLink'><a className='button' href="/PSetSearch">Search and Request</a></div>
                            </div>
                        </div>
                        <div className='mainMenuItem' style={{ alignSelf: 'flex-start'}}>
                            <h2>View PSet Request Status</h2>
                            <div className='mainMenuItemContent'>
                                <div>ORCESTRA is currently processing following requests:</div>
                                <div className='mainMenuItemLine'><span className='largeNum'>3</span> <span>Requests in queue.</span></div>
                                <div className='mainMenuItemLine'><span className='largeNum'>2</span> <span >Requests in process.</span></div>
                                <div className='mainMenuLink'><a className='button' href="/Dashboard">View Dashboard</a></div>
                            </div>
                        </div> 
                        <div className='mainMenuItem'>
                            <h2>Login/Register</h2>
                            <div className='mainMenuItemContent'>
                                
                            </div>
                        </div>     
                    </div>  
                </div>  
            </div>
        </div>
    );
    
}

export default OrcestraMain;