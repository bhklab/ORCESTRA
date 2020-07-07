import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../../context/auth';

const PrivateRoute = ({component: Component, ...rest}) => {
    const auth = useContext(AuthContext)
    return(
        <Route {...rest} render={(props) => (
            auth.authenticated === true
            ? <Component {...props} />
            :
            <Redirect to={{pathname: rest.redirect, state:{path: props.location.pathname}}} />
        )} />
    ) 
}

export default PrivateRoute;