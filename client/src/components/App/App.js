import React, {useEffect} from 'react';
import ReactGA from 'react-ga';
import './App.css';
import './PrimeStyle.css';
import Router from '../Routing/Router';

const App = () => {
	
	// Google Analytics set up
	useEffect(() => {
		ReactGA.initialize('UA-102362625-2')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}, [])
	
	return (
		<div className="App">
			<Router />
		</div>
	)
}

export default App;
