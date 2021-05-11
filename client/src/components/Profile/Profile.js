import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../../hooks/Context';
import UserInfo from './subcomponents/UserInfo';
import UserDataset from './subcomponents/UserDataset';

const StyledProfile = styled.div`
    width: 100%;
`;

const Profile = () =>{
    const auth = useContext(AuthContext);
    const [savedDatasets, setSavedDatasets] = useState([]);
    const [inProcessDatasets, setInProcessDatasets] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get(`/api/user/dataset/list?username=${auth.user.username}`);
            console.log(res.data);
            let complete = res.data.filter(itme => itme.status === 'complete');
            let pending = res.data.filter(itme => itme.status !== 'complete');
            setSavedDatasets(complete);
            setInProcessDatasets(pending);
        }
        initialize();
    }, []);

    const removeFromSavedList = async (selectedDatasets) => {
        let datasetId = selectedDatasets.map(item => (item._id));
        try{
            await axios.post('/api/user/dataset/remove', {username: auth.user.username, datasetId: datasetId});
            let updated = savedDatasets.filter(item => !datasetId.includes(item._id));
            setSavedDatasets(updated);
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className='pageContent'>
            <StyledProfile>
                <UserInfo />
                <UserDataset 
                    heading='Saved Datasets' 
                    btnLabel='Remove from List' 
                    datasets={savedDatasets} 
                    handleBtnClick={removeFromSavedList}
                />
                <UserDataset 
                    heading='Dataset Requests in Process'
                    datasets={inProcessDatasets} 
                    pending={true}
                />
            </StyledProfile>
        </div>
    );
}

export default Profile;