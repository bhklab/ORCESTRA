import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../../context/auth';

const AdminRoute = ({component: Component, ...rest}) => {
    const auth = useContext(AuthContext)
    console.log(rest)
    console.log(auth)
    return(
        <Route {...rest} render={(props) => (
            auth.isAdmin === true
            ? <Component {...props} />
            :
            <Redirect to={{pathname: rest.redirect, state:{from: props.location}}} />
        )} />
    ) 
}

export default AdminRoute;