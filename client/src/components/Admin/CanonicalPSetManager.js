import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {trackPromise} from 'react-promise-tracker';
import {Button} from 'primereact/button';
import { ThreeDots } from 'react-loader-spinner';
import { AuthContext } from '../../hooks/Context';
import PSetTable from '../SearchRequest/PSet/PSetTable';

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    button {
        margin-left: 20px;
    }
`;

const CanonicalPSetManager = () => {
    const auth = useContext(AuthContext);
    const [dataObjects, setDataObjects] = useState({ready: false, psets: []});
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const res = await trackPromise(axios.get('/api/view/admin/canonical_psets'));
            setSelected(res.data.filter(p => {return p.info.canonical}));
            setDataObjects({ready: true, psets: res.data});
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCanonicalPSets = async (event) => {
        event.preventDefault()
        setDataObjects({...dataObjects, ready: false})
        const res = await axios.post('/api/data-objects/update_canonical', {selected: selected});
        setSelected(res.data.filter(p => {return p.info.canonical}));
        setDataObjects({ready: true, psets: res.data});
    }

    return(
        <React.Fragment>
            <MenuContainer>
                <h4>Update Canonical PSets</h4>
                <Button label='Update' type='submit' onClick={updateCanonicalPSets} />
            </MenuContainer>
            {
                dataObjects.ready ?
                <PSetTable 
                    psets={dataObjects.psets} 
                    selectedPSets={selected} 
                    updatePSetSelection={(e) => {setSelected(e.value)}} 
                    scrollHeight='600px'
                    authenticated={auth.user ? true : false}
                    download={false}
                /> 
                :
                <ThreeDots color="#3D405A" height={100} width={100} />
            }
        </React.Fragment>
    );
}

export default CanonicalPSetManager;