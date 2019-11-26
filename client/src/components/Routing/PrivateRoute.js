import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../../context/auth';

class PrivateRoute extends React.Component {
    
    static contextType = AuthContext;

    componentDidMount(){
        fetch('/user/checkToken')
            .then(res => {
                if(res.status === 200){
                    return(res.json());
                }else{
                    console.log('token invalid');
                    return({authenticated: false, username: ''});
                }
            })
            .then(data => {this.context.setAuthToken(data)});
    }
    
    render(){
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