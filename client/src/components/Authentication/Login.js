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
            userRegistered: false,
            btnFindDisabled: true,
            btnLoginDisabled: true,
            btnRegDisabled: true
        }
        this.initializeState = this.initializeState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePwdInputChange = this.handlePwdInputChange.bind(this);
        this.handleRegPwdInputChange = this.handleRegPwdInputChange.bind(this);
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
                    if(this.state.email.length){
                        this.setState({btnFindDisabled: false});
                    }else{
                        this.setState({btnFindDisabled: true});
                    }
                    break;
                case 'password':
                    if(this.state.password.length){
                        this.setState({btnLoginDisabled: false});
                    }else{
                        this.setState({btnLoginDisabled: true});
                    }
                    break;
                case 'passwordReg1':
                    if(this.state.passwordReg1.length){
                        if(this.state.passwordReg1 === this.state.passwordReg2){
                            this.setState({btnRegDisabled: false});
                        }
                    }else{
                        this.setState({btnRegDisabled: true});
                    }
                    break;
                case 'passwordReg2':
                    if(this.state.passwordReg2.length){
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

    handlePwdInputChange(event){
        this.setState({[event.target.name]: event.target.value}, () => {
            if(this.state.password.length){
                this.setState({btnLoginDisabled: false});
            }else{
                this.setState({btnLoginDisabled: true});
            }
        });
    }

    handleRegPwdInputChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    onFindClick = event => {
        event.preventDefault();
        var api = 'user/check/?username=' + this.state.email;
        fetch(api)
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    userChecked: true,
                    userRegistered: resData.registered
                });
            });
    }

    onLoginClick = event => {
        event.preventDefault();
        fetch('user/login', {
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
                this.initializeState();
                this.context.setAuthToken(data);
            }else{
                this.messages.show({severity: 'error', summary: 'Login Failed', detail: 'Please re-enter your email and password.'});
            }
        });
    }

    onRegisterClick = event => {
        event.preventDefault();
    }

    loginForm(){
        return(
            <React.Fragment>
                <h4>Login with your password:</h4>
                <label>Password:</label>
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
                <h4>Email not found. Please register.</h4>
                <div>
                    <label>Password:</label>
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
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                {this.context.authenticated ? <Redirect to={this.props.location.state.path}/> : 
                    <div className='mainContent'>
                        <div className="loginRegContent">
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