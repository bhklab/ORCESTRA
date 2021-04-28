import React, {useContext} from 'react';
import {Button} from 'primereact/button';
import {AuthContext} from '../../../context/auth';
import * as APICalls from '../APICalls';

const SaveDatasetButton = (props) => {
    const auth = useContext(AuthContext);
    const {selectedDatasets, onSaveComplete, disabled} = props;
    
    const saveSelectedDatasets = (event) => {
        event.preventDefault();
        if(auth.authenticated){
            APICalls.saveOrUpdateUserPSets(auth.username, selectedDatasets, (status, data) => {onSaveComplete(status, data)});
        }
    }

    return(
        <Button label='Save' onClick={saveSelectedDatasets} disabled={disabled}/>
    );
}

export default SaveDatasetButton;
