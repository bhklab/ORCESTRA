import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../../hooks/Context';
import UserInfo from './subcomponents/UserInfo';
import UserPSet from './subcomponents/UserPSet';

const StyledProfile = styled.div`
    width: 100%;
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

    const removeFromSavedList = async (selectedPSets) => {
        let psetID = selectedPSets.map(item => (item._id));
        try{
            await axios.post('/api/user/pset/remove', {username: auth.user.username, psetID: psetID});
            let updated = savedPSets.filter(item => !psetID.includes(item._id));
            setSavedPSets(updated);
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className='pageContent'>
            <StyledProfile>
                <UserInfo />
                <UserPSet 
                    heading='Saved PSets' 
                    btnLabel='Remove from List' 
                    pset={savedPSets} 
                    handleBtnClick={removeFromSavedList}
                />
                <UserPSet 
                    heading='PSet Requests in Process'
                    pset={inProcessPSets} 
                    pending={true}
                />
            </StyledProfile>
        </div>
    );
}

export default Profile;