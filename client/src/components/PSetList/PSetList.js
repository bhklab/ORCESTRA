import React from 'react';
import './PSetList.css';
import Navigation from '../Navigation/Navigation'

class PSetList extends React.Component{
    state = {users: []}
	
	componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(users => this.setState({users}));
    }
    
    render(){
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>PSetList Page</h1>
                    <h1>Users</h1>
                    {this.state.users.map(user =>
                        <div key={user.id}>{user.username}</div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default PSetList;