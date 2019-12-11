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
                        <a className='button' href="/Stats">Overall Stats</a>
                        <a className='button' href="/PSetList">Existing PSets</a>
                        <a className='button' href="/PSetRequest">Request PSets</a>
                    </div>
                </div>
                
			</div>
		);
	}
    
}

export default OrcestraMain;