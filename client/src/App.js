import React, {useEffect} from 'react';
import ReactGA from 'react-ga';
import './styles/prime-style.css';
import GlobalStyles from './styles/GlobalStyles';
import Router from './Routes/Router';

const App = () => {
	
	// Google Analytics set up
	useEffect(() => {
		ReactGA.initialize('UA-102362625-2')
		ReactGA.pageview(window.location.pathname + window.location.search)
	}, [])
	
	return (
		<React.Fragment>
			<GlobalStyles />
			<Router />
		</React.Fragment>
	)
}

export default App;
