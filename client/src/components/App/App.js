import React from 'react';
import './App.css';
import './PrimeStyle.css';
import Router from '../Routing/Router';

class App extends React.Component {
	render(){
		return (
			<div className="App">
				<Router />
			</div>
		);
	}
}

export default App;
