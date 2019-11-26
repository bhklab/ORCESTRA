import React from 'react';
import './UserInfo.css'
import {Button} from 'primereact/button';
import {AuthContext} from '../../../context/auth';

class UserInfo extends React.Component{
    
    constructor(){
        super();
        this.state = {
            user: {}
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        fetch('/user/?username=' + this.context.username)
            .then(res => res.json())
            .then(user => this.setState({user: user}));
    }

    showModal(){

    }

    hideModal(){

    }
    
    render(){
        return(
            <div className='userInfoContainer'>
                <h2>User Information</h2>
                <div className='userInfo'>Username: {this.state.user.username}</div>
                <div className='userInfoBtn'>
                    <Button label='Change User Settings' onClick={this.showModal} />
                </div>
            </div>
        );
    }
}

export default UserInfo;