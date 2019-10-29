import React from 'react';
import './App.css';

import Navigation from '../Navigation/Navigation';
import Main from '../Main/Main';

class App extends React.Component {
	render(){
		return (
			<div className="App">
				<Navigation />
				<Main />
			</div>
		);
	}
}

export default App;
