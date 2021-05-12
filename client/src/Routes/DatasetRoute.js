import React, {useState, useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';

const DatasetRoute = ({component: Component, location, ...rest}) => {
    const [authorized, setAuthrized] = useState(null);

    useEffect(() => {
        console.log(location);
        setAuthrized(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if(!authorized){
        return null;
    }

    return(
        <Route 
            {...rest} 
            render={props => (
                authorized ? 
                <Component {...props} />
                :
                <Redirect to={{pathname: rest.redirect, state:{ from: location }}} />
            )} 
        />
    );
}

export default DatasetRoute;
