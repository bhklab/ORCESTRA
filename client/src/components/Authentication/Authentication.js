import React, { useState } from 'react';
import axios from 'axios';

import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import CustomMessages from '../Shared/CustomMessages';
import StyledAuthForm from './StyledAuthForm';

import useAuth from '../../hooks/useAuth';

const errorMessage = { 
    severity: 'error', 
    summary: 'Login Failed', 
    detail: 'Please try again with correct credentials.', 
    sticky: true 
};

const Authentication = (props) => {
    const { location } = props;
    const { submitUser, error } = useAuth();

    const [user, setUser] = useState({
        username: '',
        password1: '',
        password2: '',
        action: ''
    });

    const findUser = async (e) => {
        e.preventDefault();
        setUser({...user, action: ''});
        const res = await axios.get(`/api/user/find/?username=${user.username}`);
        console.log(res.data);
        setUser({...user, action: res.data.action});
    }

    const onResetClick = async (event) => {
        event.preventDefault();
        console.log('reset click');
        const res = await axios.post('/api/user/reset/email', { email: user.username} );
        console.log(res);
        if(res.status === 200){
            Authentication.messages.show({severity: 'success', summary: 'Email has been sent.', detail: 'Please follow the link in the email to reset your password.'});
        }else{
            Authentication.messages.show({severity: 'error', summary: 'An error occurred', detail: res.data.message});
        }
    }

    const disableFind = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return !regex.test(user.username);
    }

    const disableSubmit = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        switch(user.action){
            case 'login':
                return(user.password1.length < 6 || !regex.test(user.username));
            case 'register':
                return(
                    user.password1.length < 6 ||
                    user.password1.localeCompare(user.password2) !== 0 ||
                    !regex.test(user.username)
                );
            default:
                return true;
        }
    }

    return(
        <div className='pageContent'>
            <StyledAuthForm>
                <h3>Login / Register</h3>
                <Messages ref={(el) => Authentication.messages = el}></Messages>
                <CustomMessages trigger={error} message={errorMessage} />
                <h5>Enter your email:</h5>
                <div className='emailInput'>
                    <InputText 
                        type='email' 
                        name='email' 
                        value={user.username} 
                        onChange={(e) => {setUser({...user, username: e.target.value})}} 
                    />
                    <Button 
                        className='btnLoginFind' 
                        label='Find' 
                        icon="pi pi-arrow-right" 
                        onClick={findUser} disabled={disableFind()} 
                    />
                </div>
                {
                    user.action.length > 0 &&
                    <React.Fragment>
                        <h4>{user.action === 'login' ? '' : 'Please register:'}</h4>
                        <div className='message'>Password needs to be at least 6 characters in length</div>
                        <InputText 
                            className='pwdInput' 
                            type='password' 
                            value={user.password1} 
                            onChange={(e) => {setUser({...user, password1: e.target.value})}}
                        />
                        {
                            user.action === 'register' &&
                            <div>
                                <label>Confirm your password:</label>
                                <InputText 
                                    className='pwdInput' 
                                    type='password' 
                                    value={user.password2} 
                                    onChange={(e) => {setUser({...user, password2: e.target.value})}}
                                />
                            </div>
                        }
                        <div>
                            <Button 
                                label={user.action === 'login' ? 'Login' : 'Register'}  
                                onClick={(e) => {
                                    e.preventDefault();
                                    submitUser(user, location);
                                }} 
                                disabled={disableSubmit()}
                            />
                        </div>
                        <div>
                            <button className='forgotPasswordBtn' onClick={onResetClick}>Reset your password</button>
                        </div>
                    </React.Fragment> 
                }
            </StyledAuthForm>   
        </div>
    );
}

export default Authentication;