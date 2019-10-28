import React from 'react';
import '../css/Main.css';

class OrcestraMain extends React.Component {
    state = {users: []}
	
	componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(users => this.setState({users}));
    }

    render(){
		return (
			<div className='mainContent'>
				{/*<h1>Users</h1>
				{this.state.users.map(user =>
					<div key={user.id}>{user.username}</div>
				)}*/}

                <div className="home">
                    <h1>ORCESTRA</h1>   
                    <h2>Orchestration platform for reproducing pharmacogenomic analyses</h2>
                    <div className="links">
                        <a href="/">Overall Stats</a>
                        <a href="/psets">Existing PSets</a>
                        <a href="/requestPSet">Request PSets</a>
                    </div>
                </div>

			</div>
		);
	}
    
}

export default OrcestraMain;