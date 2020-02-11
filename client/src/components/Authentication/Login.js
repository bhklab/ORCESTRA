import React, {useContext} from 'react';
import Navigation from '../Navigation/Navigation';
import { Redirect } from 'react-router-dom';
import AuthForm from './AuthForm';
import './Login.css';
import Footer from '../Footer/Footer';
import {AuthContext} from '../../context/auth';

const Login = (props) => {
    const auth = useContext(AuthContext);
    const msg = props.location.state.logoutMsg;
    return(
        <React.Fragment>
            <Navigation routing={props} />
            {auth.authenticated ? <Redirect to={props.location.state.path}/> : 
                <div className='pageContent'>
                    <div className="loginRegContent">
                        <div className='logoutMsg'>{msg ? msg : ''}</div>
                        <AuthForm />
                    </div>   
                </div>
            }
            <Footer />
        </React.Fragment>
    );
}

export default Login;