import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../../context/auth';

class PrivateRoute extends React.Component {
    
    static contextType = AuthContext;
    
    render(){
        console.log(this.props);
        const userAuth = this.context;
        return(
            <Route            
                exact path={this.props.path} 
                render={() => userAuth.authenticated ? this.props.component : (<Redirect to={{pathname: this.props.redirect, state: {path: this.props.path}}} />)}
            />
        );
    }
}

export default PrivateRoute;