import React, {useContext} from 'react';
import axios from 'axios';
import {Button} from 'primereact/button';
import { AuthContext } from '../../../hooks/Context';

const SaveDatasetButton = (props) => {
    const auth = useContext(AuthContext);
    const {selectedDatasets, onSaveComplete, disabled} = props;
    
    const saveSelectedDatasets = async (event) => {
        event.preventDefault();
        if(auth.user && selectedDatasets.length){
            let userPSet = { 
                username: auth.user.username,
                psetId: selectedDatasets.map(item => (item._id))
            };
            let res = null;
            try{
                res = await axios.post('/api/user/pset/add', userPSet);
                onSaveComplete(1, res.data);
            }catch(err){
                console.log(err);
                onSaveComplete(0, res.data);
            }
        }
    }

    return(
        <Button label='Save' onClick={saveSelectedDatasets} disabled={disabled}/>
    );
}

export default SaveDatasetButton;
