import React, {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import AuthForm from './AuthForm';
import './Login.css';
import {AuthContext} from '../../context/auth';
import {withRouter} from 'react-router';

const Login = (props) => {
    const auth = useContext(AuthContext);
    const { location } = props
    const msg = location.state ? location.state.logoutMsg : undefined;

    return(
        <React.Fragment>
            {auth.authenticated ? 
                    location.state && location.state.path !== '/' ? 
                    <Redirect to={location.state.path}/> 
                    :
                    <Redirect to={'/Profile'}/> 
                : 
                <div className='pageContent'>
                    <div className="loginRegContent">
                        <div className='logoutMsg'>{msg ? msg : ''}</div>
                        <AuthForm />
                    </div>   
                </div>
            }
        </React.Fragment>
    );
}

export default withRouter(Login);