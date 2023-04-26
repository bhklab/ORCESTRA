import React, {useEffect} from 'react';
import ReactGA from 'react-ga4';
import './styles/prime-style.css';
import GlobalStyles from './styles/GlobalStyles';
import Router from './Routes/Router';

const App = () => {
	
	// Google Analytics set up
	useEffect(() => {
		ReactGA.initialize('G-EVTHFJT6FE')
		ReactGA.send({
      hitType: "pageview", 
      path: window.location.pathname + window.location.search
    });
	}, [])
	
	return (
		<React.Fragment>
			<GlobalStyles />
			<Router />
		</React.Fragment>
	)
}

export default App;
