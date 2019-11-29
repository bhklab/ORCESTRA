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
                render={(props) => userAuth.authenticated ? React.cloneElement(this.props.component, {...props}) : (<Redirect to={{pathname: this.props.redirect, state: {path: this.props.path}}} />)}
            />
        );
    }
}

export default PrivateRoute;