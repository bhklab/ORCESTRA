import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import styled from 'styled-components';

import {Messages} from 'primereact/messages';
import { AuthContext } from '../../hooks/Context';
import * as Helper from '../Shared/Helper';
import UserInfo from './subcomponents/UserInfo';
import UserPSet from './subcomponents/UserPSet';

const StyledProfile = styled.div`
    display: flex;
    .main {
        margin-left: 20px;
    }
`;

const Profile = () =>{
    const auth = useContext(AuthContext);
    const [savedPSets, setSavedPSets] = useState([]);
    const [inProcessPSets, setInProcessPSets] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get(`/api/user/pset/?username=${auth.user.username}`);
            console.log(res.data);
            let complete = res.data.filter(itme => itme.status === 'complete');
            let pending = res.data.filter(itme => itme.status !== 'complete');
            setSavedPSets(complete);
            setInProcessPSets(pending);
        }
        initialize();
    }, []);

    const removeFromSavedList = async (selectedPSets, callback) => {
        let psetID = selectedPSets.map(item => (item._id));
        try{
            await axios.post('/api/user/pset/remove', {username: auth.user.username, psetID: psetID});
            let updated = savedPSets.filter(item => !psetID.includes(item._id));
            setSavedPSets(updated);
            callback(0);
        }catch(err){
            console.log(err);
            Helper.messageAfterRequest(0, err, null, Profile.messages);
            callback(1);
        }
    }

    // const cancelPSetRequest = async (selectedPSet, callback) => {
    //     let psetID = selectedPSet.map(item => (item._id));
    //     try{
    //         const res = await axios.post('/api/pset/cancel', {username: auth.user.username, psetID: psetID});
    //         Helper.messageAfterRequest(1, res.data, null, Profile.messages);
    //         let inProcess = psetInProcess;
    //         inProcess = removePSetByID(inProcess, psetID);
    //         this.setState({psetInProcess: inProcess}, callback(0));
    //     }catch(err){
    //         console.log(err);
    //         Helper.messageAfterRequest(0, err, null, Profile.messages);
    //         callback(1);
    //     }
    // }

    return(
        <div className='pageContent'>
            <StyledProfile>
                <UserInfo />
                <div className='main'>
                    <Messages ref={(el) => Profile.messages = el} />
                    <UserPSet 
                        heading='Your Saved PSets' 
                        btnLabel='Remove from List' 
                        pset={savedPSets} 
                        handleBtnClick={removeFromSavedList}
                        messages={Profile.messages}
                    />
                    <UserPSet 
                        heading='Your PSet Requests in Process'
                        pset={inProcessPSets} 
                        pending={true}
                    />
                </div>
            </StyledProfile>
        </div>
    );
}

export default Profile;