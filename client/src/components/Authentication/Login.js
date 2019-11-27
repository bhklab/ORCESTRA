import React from 'react';
import Navigation from '../Navigation/Navigation';
import { Redirect } from 'react-router-dom';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';
import './Login.css';


class Login extends React.Component{
    
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            passwordReg1: '',
            passwordReg2: '',
            userChecked: false,
            userExists: false,
            userRegistered: false,
            btnFindDisabled: true,
            btnLoginDisabled: true,
            btnRegDisabled: true
        }
        this.initializeState = this.initializeState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFindClick = this.onFindClick.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.loginForm = this.loginForm.bind(this);
        this.registerForm = this.registerForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    static contextType = AuthContext;

    initializeState(){
        this.setState({
            email: '',
            password: '',
            passwordReg1: '',
            passwordReg2: '',
            userChecked: false,
            userExists: false,
            userRegistered: false,
            btnFindDisabled: true,
            btnLoginDisabled: true,
            btnRegDisabled: true
        });
    }

    handleInputChange(event){
        var name = event.target.name;
        this.setState({[name]: event.target.value}, () => {
            switch(name){
                case 'email':
                    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                    if(regex.test(this.state.email)){
                        this.setState({btnFindDisabled: false});
                    }else{
                        this.setState({btnFindDisabled: true});
                    }
                    break;
                case 'password':
                    if(this.state.password.length >= 6){
                        this.setState({btnLoginDisabled: false});
                    }else{
                        this.setState({btnLoginDisabled: true});
                    }
                    break;
                case 'passwordReg1':
                    if(this.state.passwordReg1.length >= 6){
                        if(this.state.passwordReg1 === this.state.passwordReg2){
                            this.setState({btnRegDisabled: false});
                        }
                    }else{
                        this.setState({btnRegDisabled: true});
                    }
                    break;
                case 'passwordReg2':
                    if(this.state.passwordReg2.length >= 6){
                        if(this.state.passwordReg1 === this.state.passwordReg2){
                            this.setState({btnRegDisabled: false});
                        }
                    }else{
                        this.setState({btnRegDisabled: true});
                    }
                    break;
                default:
                    break;
            }
        });
    }

    onFindClick = event => {
        event.preventDefault();
        var api = 'user/check/?username=' + this.state.email;
        fetch(api)
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    userChecked: true,
                    userExists: resData.exists,
                    userRegistered: resData.registered
                });
            });
    }

    onLoginClick = event => {
        event.preventDefault();
        fetch('/user/login', {
            method: 'POST',
            body: JSON.stringify({
                user: {
                   username: this.state.email,
                   password: this.state.password 
                }   
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.authenticated){
                console.log('authenticated');
                this.initializeState();
                this.context.setAuthToken(data);
            }else{
                this.messages.show({severity: 'error', summary: 'Login Failed', detail: 'Please re-enter your email and password.'});
            }
        });
    }

    onRegisterClick = event => {
        event.preventDefault();
        fetch('/user/register', {
            method: 'POST',
            body: JSON.stringify({
                user: {
                    username: this.state.email,
                    password: this.state.passwordReg1,
                    exists: this.state.userExists
                }
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                this.initializeState();
                this.context.setAuthToken({authenticated: data.authenticated, username: data.username});
            }else{
                this.messages.show({severity: 'error', summary: 'Registration Failed', detail: 'Please try again.'});
            }
        });
    }

    loginForm(){
        return(
            <React.Fragment>
                <h4>Login with your password:</h4>
                <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                <InputText className='pwdInput' type='password' name='password' value={this.state.password} onChange={this.handleInputChange}/>
                <div>
                    <Button label='Login' onClick={this.onLoginClick} disabled={this.state.btnLoginDisabled}/>
                </div>
            </React.Fragment>
        );
    }

    registerForm(){
        return(
            <React.Fragment>
                <h4>{this.state.userExists ? 'Email is not registered. ': 'Email not found. '}Please register.</h4>
                <div>
                    <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                    <InputText className='pwdInput' type='password' name='passwordReg1' value={this.state.passwordReg1} onChange={this.handleInputChange}/>
                </div>
                <div>
                    <label>Confirm your password:</label>
                    <InputText className='pwdInput' type='password' name='passwordReg2' value={this.state.passwordReg2} onChange={this.handleInputChange}/>
                </div>
                <div>
                    <Button label='Register' onClick={this.onRegisterClick} disabled={this.state.btnRegDisabled}/>
                </div>
            </React.Fragment>
        );
    }

    renderForm(){
        if(this.state.userChecked){
            return(
                <div className='formContainer'>
                    {this.state.userRegistered ? this.loginForm() : this.registerForm()}
                </div>
            );
        }
        return('');
    }
    
    render(){     
        const msg = this.props.location.state.logoutMsg;
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                {this.context.authenticated ? <Redirect to={this.props.location.state.path}/> : 
                    <div className='mainContent'>
                        <div className="loginRegContent">
                            <div className='logoutMsg'>{msg ? msg : ''}</div>
                            <h2>Login/Register</h2>
                            <Messages ref={(el) => this.messages = el}></Messages>
                            <h4>Enter your email:</h4>
                            <div className='emailInput'>
                                <InputText type='email' name='email' value={this.state.email} onChange={this.handleInputChange}/>
                                <Button className='btnLoginFind' label='Find' icon="pi pi-arrow-right" onClick={this.onFindClick} disabled={this.state.btnFindDisabled}/>
                            </div>
                            {this.renderForm()}
                        </div>   
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default Login;