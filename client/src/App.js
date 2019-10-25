import React from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends React.Component {
	state = {users: []}
	
	componentDidMount(){
		fetch('/pset')  
    .then(res => res.json())
    .then(users => this.setState({users}));
	}
	
	render(){
		return (
			<div className="App">
				<h1>Users</h1>
				{this.state.users.map(user =>
					<div key={user.id}>{user.username}</div>
				)}
			</div>
		);
	}
}

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default App;
