import React, {useState, useContext, useEffect} from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import { AuthContext } from '../../../hooks/Context';

const StyledUserInfo = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    width: 100%;
    margin-bottom: 10px;
    padding: 1px 20px 20px 20px;
    border-radius: 10px;
    .userInfo{
        margin-bottom: 20px;
        font-size: 12px;
    }
    .userInfoBtn{
        margin-top: 20px;
    }
    .userInfoBtn .pwdReset {
        margin-right: 5px;
    }
`;

const UserInfo = () => {
    const auth = useContext(AuthContext);
    const [show, setShow] = useState(false)
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [btnResetDisabled, setBtnResetDisabled] = useState(true)

    useEffect(() => {
        password1.length >= 6 ?  password1 === password2 && setBtnResetDisabled(false) : setBtnResetDisabled(true);
    }, [password1, password2])
    
    const showPwdReset = (event) => {
        event.preventDefault()
        setShow(true)
    }

    const hidePwdReset = (event) => {
        event.preventDefault()
        setShow(false)
    }

    const resetPwd = async (event) => {
        event.preventDefault()
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
    }

    return(
        <StyledUserInfo>
            <h2>Profile</h2>
            <Messages ref={(el) => UserInfo.messages = el}></Messages>
            <div className='userInfo'>Username: {auth.user.username}</div>
            { auth.user.admin && <div className='userInfo'><Link to = '/app/admin'>Admin Menu</Link></div> }
            {
                show &&
                <div>
                    <div>
                        <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                        <InputText className='pwdInput' type='password' name='password1' value={password1} onChange={(e) => {setPassword1(e.target.value)}}/>
                    </div>
                    <div>
                        <label>Confirm your password:</label>
                        <InputText className='pwdInput' type='password' name='password2' value={password2} onChange={(e) => {setPassword2(e.target.value)}}/>
                    </div> 
                </div> 
            }
            <div className='userInfoBtn'>
                {
                    show ? 
                    <div>
                        <Button className='pwdReset' label='Reset' onClick={resetPwd} disabled={btnResetDisabled}/>
                        <Button className='pwdReset' label='Cancel' onClick={hidePwdReset}/>
                    </div>
                    :
                    <Button label='Reset password' onClick={showPwdReset}/>
                }
                
            </div>
        </StyledUserInfo>
    );
}

export default UserInfo;