import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../../context/auth';
import Profile from '../Profile/Profile';

class PrivateRoute extends React.Component {
    
    static contextType = AuthContext;
    
    render(){
        const userAuth = this.context;
        return(
            <Route            
                exact path={this.props.path} 
                render={() => userAuth.authenticated ? this.props.component : (<Redirect to={this.props.redirect} />)}
            />
        );
    }
}

export default PrivateRoute;