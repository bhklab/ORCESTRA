import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import StyledPage from '../../styles/StyledPage';
import CustomMessages from '../Shared/CustomMessages';
import StyledAuthForm from './StyledAuthForm';
import 'primeicons/primeicons.css';
import useAuth from '../../hooks/useAuth';

const errorMessage = {
    severity: 'error',
    summary: 'Login Failed',
    detail: 'Please try again with correct credentials.',
    sticky: true
};

const Authentication = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { submitUser, error } = useAuth();
    const [user, setUser] = useState({
        username: '',
        password1: '',
        password2: '',
        action: ''
    });

    const findUser = async e => {
        e.preventDefault();
        setUser({ ...user, action: '' });
        const res = await axios.get(`/api/user/find/?username=${user.username}`);
        console.log(res.data);
        setUser({ ...user, action: res.data.action });
    };

    const onResetClick = async event => {
        event.preventDefault();
        const res = await axios.post('/api/user/reset/email', { email: user.username });
        if (res.status === 200) {
            Authentication.messages.show({
                severity: 'success',
                summary: 'Email has been sent.',
                detail: 'Please follow the link in the email to reset your password.'
            });
        } else {
            Authentication.messages.show({
                severity: 'error',
                summary: 'An error occurred',
                detail: res.data.message
            });
        }
    };

    const disableFind = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return !regex.test(user.username);
    };

    const disableSubmit = () => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        switch (user.action) {
            case 'login':
                return user.password1.length < 6 || !regex.test(user.username);
            case 'register':
                return (
                    user.password1.length < 6 ||
                    user.password1.localeCompare(user.password2) !== 0 ||
                    !regex.test(user.username)
                );
            default:
                return true;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Messages ref={el => (Authentication.messages = el)}></Messages>
            <CustomMessages trigger={error} message={errorMessage} />
            <div className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg border-1 border-gray-200">
                <h3 className="text-headingSm font-bold">Login / Register</h3>
                <div className="flex flex-col gap-1">
                    <label className="text-bodyMd font-semibold text-gray-600">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.username}
                        className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg"
                        onChange={e => setUser({ ...user, username: e.target.value })}
                    />
                    <button
                        className={`bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold ${user.action.length > 0 ? 'hidden' : ''}`}
                        onClick={findUser}
                        disabled={disableFind()}
                    >
                        Login / Register
                    </button>
                </div>
                {user.action.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label className="text-bodyMd font-semibold text-gray-600">Password</label>
                            <input
                                className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg"
                                type="password"
                                value={user.password1}
                                onChange={e => setUser({ ...user, password1: e.target.value })}
                            />
                            <h5
                                className={`${user.action === 'login' ? 'hidden' : 'text-bodySm font-semibold text-red-600'}`}
                            >
                                Password needs to be at least 6 characters in length
                            </h5>
                        </div>
                        {user.action === 'register' && (
                            <div className="flex flex-col">
                                <label className="text-bodyMd font-semibold text-gray-600">Confirm password</label>
                                <input
                                    className="px-2 py-1 rounded-md border-1 border-darkYellow text-bodyLg"
                                    type="password"
                                    value={user.password2}
                                    onChange={e => setUser({ ...user, password2: e.target.value })}
                                />
                                <h5
                                    className={`${user.action === 'login' ? 'hidden' : 'text-bodySm font-semibold text-red-600'}`}
                                >
                                    Password needs to be at least 6 characters in length
                                </h5>
                            </div>
                        )}
                        <button
                            className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold"
                            onClick={e => {
                                e.preventDefault();
                                submitUser(user, location);
                            }}
                            disabled={disableSubmit()}
                        >
                            {user.action === 'login' ? 'Login' : 'Register'}
                        </button>
                        <button
                            className={`bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold ${user.action === 'register' ? 'hidden' : ''}`}
                            onClick={onResetClick}
                        >
                            Reset password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Authentication;
