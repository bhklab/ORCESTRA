import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';

const StyledUserInfo = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    width: 100%;
    margin-bottom: 10px;
    padding: 1px 20px 20px 20px;
    border-radius: 10px;
    .userInfo {
        margin-bottom: 20px;
        font-size: 12px;
    }
    .userInfoBtn {
        margin-top: 20px;
    }
    .userInfoBtn .pwdReset {
        margin-right: 5px;
    }
`;

const UserInfo = () => {
    const auth = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [btnResetDisabled, setBtnResetDisabled] = useState(true);

    useEffect(() => {
        password1.length >= 6 ? password1 === password2 && setBtnResetDisabled(false) : setBtnResetDisabled(true);
    }, [password1, password2]);

    const showPwdReset = event => {
        event.preventDefault();
        setShow(true);
    };

    const hidePwdReset = event => {
        event.preventDefault();
        setShow(false);
    };

    const resetPwd = async event => {
        event.preventDefault();
        // const res = await fetch('/api/user/reset', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         user: { username: auth.user.username, password: password1 }
        //     }),
        //     headers: { 'Content-type': 'application/json' }
        // })
        // const data = await res.json();
        // if(data.authenticated){
        //     console.log('authenticated');
        //     auth.setAuthToken(data);
        //     setPassword1('')
        //     setPassword2('')
        //     setShow(false)
        //     UserInfo.messages.show({severity: 'success', summary: 'Password changed'});
        // }else{
        //     UserInfo.messages.show({severity: 'error', summary: 'Error occurred', detail: 'Password could not be changed'});
        // }
    };

    return (
        <div className="flex flex-col gap-2">
            <Messages ref={el => (UserInfo.messages = el)}></Messages>
            <div className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg border-1 border-gray-200">
                <div className="flex flex-row gap-1 items-center">
                    <h5 className="text-headingMd font-bold">Username:</h5>
                    <p className="text-bodyMd text-gray-600">{auth.user.username}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <h5 className="text-headingMd font-bold">Admin:</h5>
                    <p className="text-bodyMd text-gray-600">{auth.user.admin ? 'True' : 'False'}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <h5 className="text-headingMd font-bold">Member since:</h5>
                    <p className="text-bodyMd text-gray-600 italics">null</p>
                </div>
                <div className="flex flex-col gap-2">
                    {auth.user.admin && (
                        <div>
                            <Link
                                to="/app/admin"
                                className={`bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold ${auth.user.admin ? '' : 'hidden'}`}
                            >
                                Admin Menu
                            </Link>
                        </div>
                    )}

                    {show ? (
                        <div className="flex flex-row gap-1">
                            <button
                                className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold"
                                onClick={resetPwd}
                                disabled={btnResetDisabled}
                            >
                                Reset
                            </button>
                            <button
                                className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold"
                                onClick={hidePwdReset}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                className="bg-darkBlue text-white px-2 py-2 rounded-md text-bodyMd font-semibold"
                                onClick={showPwdReset}
                            >
                                Reset password
                            </button>
                        </div>
                    )}
                    {show && (
                        <div>
                            <div>
                                <div className="pwdMsg">Password needs to be at least 6 characters in length</div>
                                <InputText
                                    className="pwdInput"
                                    type="password"
                                    name="password1"
                                    value={password1}
                                    onChange={e => {
                                        setPassword1(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label>Confirm your password:</label>
                                <InputText
                                    className="pwdInput"
                                    type="password"
                                    name="password2"
                                    value={password2}
                                    onChange={e => {
                                        setPassword2(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
