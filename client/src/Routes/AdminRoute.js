import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../hooks/Context';

const AdminRoute = ({component: Component, location, ...rest}) => {
    const {user, loading} = useContext(AuthContext);
    
    if(loading){
        return null;
    }

    return(
        <Route 
            {...rest} 
            render={(props) => (
                user && user.admin ?
                <Component {...props} />
                :
                <Redirect to={{pathname: rest.redirect, state:{from: location}}} />
            )} 
        />
    ) 
}

export default AdminRoute;