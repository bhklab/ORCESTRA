import React, {useState, useEffect, useContext} from 'react';
import PSetTable from '../Shared/PSetTable';
import {Messages} from 'primereact/messages';
import {Button} from 'primereact/button';
import styled from 'styled-components';
import {trackPromise} from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import {AuthContext} from '../../context/auth';

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    button {
        margin-left: 20px;
    }
`

const Admin = props => {
    
    const auth = useContext(AuthContext);

    const [data, setData] = useState({ready: false, psets: []})
    const [selected, setSelected] = useState([])

    useEffect(() => {
        const getData = async () => {
            const res = await trackPromise(fetch('/api/pset/search', {
                method: 'POST',
                body: JSON.stringify({parameters: {status: 'complete'}}),
                headers: {'Content-type': 'application/json'}
            }));
            const json = await res.json()
            console.log(json);
            setSelected(json.filter(p => {return p.canonical}))
            setData({ready: true, psets: json})
        }
        getData()
    }, [])

    const updateCanonicalPSets = async (event) => {
        event.preventDefault()
        setData({...data, ready: false})
        await trackPromise(fetch('/api/pset/canonical/update', {
            method: 'POST',
            body: JSON.stringify({selected: selected}),
            headers: {'Content-type': 'application/json'}
        }));
        const res = await trackPromise(fetch('/api/pset/search', {
            method: 'POST',
            body: JSON.stringify({parameters: {status: 'complete'}}),
            headers: {'Content-type': 'application/json'}
        }));
        const json = await res.json();
        setSelected(json.filter(p => {return p.canonical}));
        setData({ready: true, psets: json});
    }

    const handleSelectionChange = (selection) => {
        console.log(selection);
        setSelected(selection);
    }
    
    return(
        <div className='pageContent'>
            <h2>Administrator's Menu</h2>
            <Messages ref={(el) => Admin.messages = el} />
            <MenuContainer>
                <h3>Update Canonical PSets</h3>
                <Button label='Update' type='submit' onClick={updateCanonicalPSets} />
            </MenuContainer>
            {
                data.ready ?
                <PSetTable 
                    psets={data.psets} selectedPSets={selected} 
                    updatePSetSelection={handleSelectionChange} scrollHeight='600px'
                    authenticated={auth.authenticated}
                    download={false}
                /> 
                :
                <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
            }
        </div>
    )
}

export default Admin