import React from 'react';
import './Main.css';

class OrcestraMain extends React.Component {
    
    render(){
		return (
			<div className='mainContent'>
                <div className="home">
                    <h1>ORCESTRA</h1>   
                    <h2>Orchestration platform for reproducing pharmacogenomic analyses</h2>
                    <div className="links">
                        <a className='button' href="/Stats">View Statistics</a>
                        <a className='button' href="/PSetSearch">Search and <br />Request PSets</a>
                        <a className='button' href="/Profile">View Your Profile</a>
                    </div>
                </div>
                
			</div>
		);
	}
    
}

export default OrcestraMain;