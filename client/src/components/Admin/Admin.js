import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';

import {Messages} from 'primereact/messages';
import {Button} from 'primereact/button';
import styled from 'styled-components';
import {trackPromise} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import StyledPage from '../../styles/StyledPage';
import { AuthContext } from '../../hooks/Context';
import PSetTable from '../SearchRequest/PSet/PSetTable';
import DataSubmissionList from '../DataSubmission/DataSubmissionList';

const Container = styled.div`
    .title {
        font-size: 20px;
        font-weight: bold;
    }
    .bottom {
        margin-top: 20px;
    }
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    button {
        margin-left: 20px;
    }
`

const Admin = () => {
    
    const auth = useContext(AuthContext);

    const [datasets, setDatasets] = useState({ready: false, psets: []});
    const [selected, setSelected] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const res = await trackPromise(axios.get('/api/view/admin'));
            setSelected(res.data.datasets.filter(p => {return p.canonical}));
            setDatasets({ready: true, psets: res.data.datasets});
            setSubmissions(res.data.submissions);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateCanonicalPSets = async (event) => {
        event.preventDefault()
        setDatasets({...datasets, ready: false})
        await trackPromise(axios.post('/api/admin/dataset/canonical/update', {selected: selected}));
        const res = await trackPromise(axios.post('/api/pset/search', {parameters: {status: 'complete', private: false}}));
        setSelected(res.data.filter(p => {return p.canonical}));
        setDatasets({ready: true, psets: res.data});
    }

    const markCompleteSubmisson = async (e, id) => {
        e.preventDefault();
        console.log(id);
        await axios.post(`/api/admin/submission/complete/${id}`, {});
        const res = await axios.get('/api/admin/submission/list');
        setSubmissions(res.data);
    }
    
    return(
        <StyledPage>
            <Container>
                <div className='title'>Administrator's Menu</div>
                <Messages ref={(el) => Admin.messages = el} />
                <MenuContainer>
                    <h4>Update Canonical PSets</h4>
                    <Button label='Update' type='submit' onClick={updateCanonicalPSets} />
                </MenuContainer>
                {
                    datasets.ready ?
                    <PSetTable 
                        psets={datasets.psets} 
                        selectedPSets={selected} 
                        updatePSetSelection={(e) => {setSelected(e.value)}} 
                        scrollHeight='600px'
                        authenticated={auth.user ? true : false}
                        download={false}
                    /> 
                    :
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                }
                <DataSubmissionList 
                    className='bottom'
                    heading='Data Submissions'
                    datasets={submissions}
                    admin={true}
                    markComplete={markCompleteSubmisson}
                />
            </Container>
        </StyledPage>
    )
}

export default Admin