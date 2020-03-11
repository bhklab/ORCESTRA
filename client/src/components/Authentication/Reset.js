import React, {useState, useEffect} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Messages} from 'primereact/messages';
import './Login.css';

const Reset = (props) => {

    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)

    useEffect(() => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        (password1.length >= 6 && password1 === password2 && regex.test(email)) ? setBtnDisabled(false) : setBtnDisabled(true)
    }, [email, password1, password2])

    const onResetClick = async (event) => {
        event.preventDefault()
        const res = await fetch('/api/user/reset/token', {
            method: 'POST',
            body: JSON.stringify({
                user: { 
                    username: email, 
                    password: password1,
                    token: props.match.params.token 
                }   
            }),
            headers: { 'Content-type': 'application/json' }
        })
        const data = await res.json()
        console.log(data)
        if(data.status){
            Reset.messages.show({severity: 'success', summary: 'Password has been reset', detail: 'Please login using your new password.'});
        }else{
            Reset.messages.show({severity: 'error', summary: 'Password could not be reset', detail: data.message});
        }
    }
    
    return(
        <React.Fragment>
            <div className='pageContent'>
                <div className="loginRegContent">
                    <h2>Reset Password</h2>
                    <Messages ref={(el) => Reset.messages = el}></Messages>
                    <div className='emailInput'>
                        <label>Email:</label>
                        <InputText type='email' name='email' value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    </div>
                    <div className='formContainer'>
                        <h4>Enter new password</h4>
                        <div>
                            <div className='pwdMsg'>Password needs to be at least 6 characters in length</div>
                            <InputText className='pwdInput' type='password' name='password1' value={password1} onChange={(e) => {setPassword1(e.target.value)}}/>
                        </div>
                        <div>
                            <label>Confirm new password:</label>
                            <InputText className='pwdInput' type='password' name='password2' value={password2} onChange={(e) => {setPassword2(e.target.value)}}/>
                        </div>
                        <div>
                            <Button label='Reset' onClick={onResetClick} disabled={btnDisabled}/>
                        </div>
                    </div>
                </div> 
            </div>
        </React.Fragment>
    );
}

export default Reset