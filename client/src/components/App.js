import React from 'react';
import '../css/App.css';

import Navigation from './Navigation';
import AppContainer from './AppContainer';
import OrcestraMain from './OrcestraMain';

class App extends React.Component {
	render(){
		return (
			<div className="App">
				<Navigation />
				<OrcestraMain />
			</div>
		);
	}
}

export default App;
