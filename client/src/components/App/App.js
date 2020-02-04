import React from 'react';
import './App.css';
import './PrimeStyle.css';

import Navigation from '../Navigation/Navigation';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';

class App extends React.Component {
	render(){
		return (
			<div className="App">
				<Navigation routing={this.props} />
				<Main />
				<Footer />
			</div>
		);
	}
}

export default App;
