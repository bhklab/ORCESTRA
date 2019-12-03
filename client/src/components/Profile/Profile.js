import React from 'react';
import './Profile.css';
import Navigation from '../Navigation/Navigation'
import UserInfo from './subcomponents/UserInfo';
import UserPSet from './subcomponents/UserPSet';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';
import * as APIHelper from '../Shared/PSetAPIHelper';

class Profile extends React.Component{

    constructor(){
        super();
        this.state = {
            username: '',
            userEmail: '',
            psetSaved: [],
            psetInProcess: []
        }
        this.removeFromSavedList = this.removeFromSavedList.bind(this);
        this.cancelPSetRequest = this.cancelPSetRequest.bind(this);
        this.findPSetByID = this.findPSetByID.bind(this);
        this.removePSetByID = this.removePSetByID.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        fetch('/user/pset/?username=' + this.context.username)  
            .then(res => res.json())
            .then(resData => {
                let complete = [];
                let pending = [];
                for(let i = 0; i < resData.length; i++){
                    if(resData[i].status === 'complete'){
                        complete.push(resData[i]);
                    }else{
                        pending.push(resData[i]);
                    }
                }
                this.setState({
                    psetSaved: complete,
                    psetInProcess: pending
                });
            });
    }

    removeFromSavedList = (selectedPSet, callback) => {
        var psetID = []
        for(let i = 0; i < selectedPSet.length; i++){
            psetID.push(selectedPSet[i]._id);
        }
        fetch('/user/pset/remove', {
            method: 'POST',
            body: JSON.stringify({username: this.context.username, psetID: psetID}),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(resData => {
                APIHelper.messageAfterRequest(1, resData, null, this.messages);
                var saved = this.state.psetSaved;
                saved = this.removePSetByID(saved, psetID);
                this.setState({psetSaved: saved}, callback(0));
            })
            .catch(err => {
                APIHelper.messageAfterRequest(0, err, null, this.messages);
                callback(1);
            });
    }

    cancelPSetRequest = (selectedPSet, callback) => {
        var psetID = []
        for(let i = 0; i < selectedPSet.length; i++){
            psetID.push(selectedPSet[i]._id);
        }
        fetch('/pset/cancel', {
            method: 'POST',
            body: JSON.stringify({username: this.context.username, psetID: psetID}),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(resData => {
                APIHelper.messageAfterRequest(1, resData, null, this.messages);
                var inProcess = this.state.psetInProcess;
                inProcess = this.removePSetByID(inProcess, psetID);
                this.setState({psetInProcess: inProcess}, callback(0));
            })
            .catch(err => {
                APIHelper.messageAfterRequest(0, err, null, this.messages);
                callback(1);
            });
    }

    findPSetByID(psetArray, id){
        for(let i = 0; i < psetArray.length; i++){
            if(psetArray[i]._id === id){
                return(i)
            }
        }
        return(-1);
    }

    removePSetByID(psets, selected){
        for(let i = 0; i < selected.length; i++){
            let index = this.findPSetByID(psets, selected[i]);
            if(index > -1){
                psets.splice(index, 1);
            }
        }
        return(psets);
    }

    render(){   
        return(
            <React.Fragment>
                <Navigation routing={this.props}/>
                <div className='pageContent'>
                    <h1>Your Profile</h1>
                    <div className='userProfile'>
                        <UserInfo />
                        <div className='userPSetLists'>
                            <Messages ref={(el) => this.messages = el} />
                            <UserPSet heading='Your Saved PSets' btnLabel='Remove from List' 
                                pset={this.state.psetSaved} 
                                handleBtnClick={this.removeFromSavedList}
                                messages={this.messages}
                            />
                            <UserPSet heading='Your PSet Requests in Process' btnLabel='Cancel Request' 
                                pset={this.state.psetInProcess} 
                                pending={true}
                                handleBtnClick={this.cancelPSetRequest}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Profile;