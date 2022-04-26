import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { AuthContext } from '../../hooks/Context';
import StyledPage from '../../styles/StyledPage';
import UserInfo from './subcomponents/UserInfo';
import UserDataset from './subcomponents/UserDataset';
// import DataSubmissionList from '../DataSubmission/DataSubmissionList';

const StyledProfile = styled.div`
    width: 100%;
`;

const Profile = () =>{
    const auth = useContext(AuthContext);
    const [savedDatasets, setSavedDatasets] = useState([]);
    const [inProcessDatasets, setInProcessDatasets] = useState([]);
    // const [dataSubmissions, setDataSubmissions] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            const res = await axios.get('/api/view/user/profile/main', {params: {username: auth.user.username}});
            console.log(res.data);
            let complete = res.data.datasets.filter(item => item.info.status === 'complete');
            let pending = res.data.datasets.filter(item => item.info.status !== 'complete');
            setSavedDatasets(complete);
            setInProcessDatasets(pending);
            // setDataSubmissions(res.data.submissions);
        }
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <StyledPage>
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
                {/* <DataSubmissionList 
                    heading='Data Submissions'
                    datasets={dataSubmissions}
                /> */}
            </StyledProfile>
        </StyledPage>
    );
}

export default Profile;