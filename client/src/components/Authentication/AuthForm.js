import React, {useState, useContext, useEffect} from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';

const AuthForm = (props) => {
    
    const auth = useContext(AuthContext);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordReg1, setPasswordReg1] = useState('');
    const [passwordReg2, setPasswordReg2] = useState('');
    const [userChecked, setUserChecked] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [userRegistered, setUserRegistered] = useState(false);
    const [btnFindDisabled, setBtnFindDisabled] = useState(true);
    const [btnLoginDisabled, setBtnLoginDisabled] = useState(true);
    const [btnRegDisabled, setBtnRegDisabled] = useState(true);

    useEffect(() => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        regex.test(email) ? setBtnFindDisabled(false) : setBtnFindDisabled(true);
    }, [email]);

    useEffect(() => {
        password.length >= 6 ? setBtnLoginDisabled(false) : setBtnLoginDisabled(true);
    }, [password]);

    useEffect(() => {
        passwordReg1.length >= 6 ?  passwordReg1 === passwordReg2 && setBtnRegDisabled(false) : setBtnRegDisabled(true);
    }, [passwordReg1, passwordReg2])

    const handleInputChange = (event) => {
        var name = event.target.name;
        switch(name){
            case 'email':
                setEmail(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            case 'passwordReg1':
                setPasswordReg1(event.target.value);
                break;
            case 'passwordReg2':
                setPasswordReg2(event.target.value);
                break;
            default:
                break;
        }
    }

    const initialize = () => {
        setEmail('');
        setPassword('');
        setPasswordReg1('');
        setPasswordReg2('');
        setUserChecked(false);
        setUserExists(false);
        setUserRegistered(false);
        setBtnFindDisabled(true);
        setBtnLoginDisabled(true);
        setBtnRegDisabled(true);
    }

    const onFindClick = async (event) => {
        event.preventDefault();
        const api = '/api/user/check/?username=' + email;
        const res = await fetch(api);
        const json = await res.json();
        if(res.ok){
            setUserChecked(true);
            setUserExists(json.exists);
            setUserRegistered(json.registered);
        }
    }

    const onLoginClick = async (event) => {
        event.preventDefault();
        const res = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                user: { username: email, password: password }   
            }),
            headers: { 'Content-type': 'application/json' }
        })
        const data = await res.json();
        if(data.authenticated){
            console.log('authenticated');
            initialize();
            auth.setAuthToken(data);
        }else{
            AuthForm.messages.show({severity: 'error', summary: 'Login Failed', detail: 'Please re-enter your email and password.'});
        }
    }

    const onRegisterClick = async (event) => {
        event.preventDefault();
        const res = await fetch('/api/user/register', {
            method: 'POST',
            body: JSON.stringify({
                user: { username: email, password: passwordReg1, exists: userExists }
            }),
            headers: { 'Content-type': 'application/json' }
        })
        const data = await res.json();
        if(res.status){
            initialize();
            auth.setAuthToken({authenticated: data.authenticated, username: data.username});
        }else{
            AuthForm.messages.show({severity: 'error', summary: 'Registration Failed', detail: data.message});
        }
    }

    const onResetClick = async (event) => {
        event.preventDefault()
        console.log('reset click')
        const res = await fetch('/api/user/reset/email', {
            method: 'POST',
            body: JSON.stringify({
                email: email 
            }),
            headers: { 'Content-type': 'application/json' }
        })
        const data = await res.json()
        if(res.ok){
            AuthForm.messages.show({severity: 'success', summary: 'Email has been sent.', detail: 'Please follow the link in the email to reset your password.'});
        }else{
            AuthForm.messages.show({severity: 'error', summary: 'An error occurred', detail: data.message});
        }
    }

    const loginForm = () => {
        return(
            <React.Fragment>
                <h4>Login with your password:</h4>
                <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                <InputText className='pwdInput' type='password' name='password' value={password} onChange={handleInputChange}/>
                <div>
                    <Button label='Login' onClick={onLoginClick} disabled={btnLoginDisabled}/>
                </div>
                <div>
                    <button className='forgotPasswordBtn' onClick={onResetClick}>Reset your password</button>
                </div>
            </React.Fragment>
        );
    }

    const registerForm = () => {
        return(
            <React.Fragment>
                <h4>{userExists ? 'Email is not registered. ': 'Email not found. '}Please register.</h4>
                <div>
                    <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                    <InputText className='pwdInput' type='password' name='passwordReg1' value={passwordReg1} onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Confirm your password:</label>
                    <InputText className='pwdInput' type='password' name='passwordReg2' value={passwordReg2} onChange={handleInputChange}/>
                </div>
                <div>
                    <Button label='Register' onClick={onRegisterClick} disabled={btnRegDisabled}/>
                </div>
            </React.Fragment>
        );
    }

    
    return(
        <React.Fragment>
            <h2>Login/Register</h2>
            <Messages ref={(el) => AuthForm.messages = el}></Messages>
            <h4>Enter your email:</h4>
            <div className='emailInput'>
                <InputText type='email' name='email' value={email} onChange={handleInputChange}/>
                <Button className='btnLoginFind' label='Find' icon="pi pi-arrow-right" onClick={onFindClick} disabled={btnFindDisabled}/>
            </div>
            { userChecked ? <div className='formContainer'>{userRegistered ? loginForm() : registerForm()}</div> : '' }
        </React.Fragment>
    );
}

export default AuthForm;