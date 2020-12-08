import React from 'react';
import {Button} from 'primereact/button';

const DownloadDatasetButton = props => {

    const downloadDataset = async (event) => {
        event.preventDefault();
        
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', props.dataset.downloadLink)
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        await fetch(`/api/${props.datasetType}/download`, {
            method: 'POST',
            body: JSON.stringify({datasetDOI: props.dataset.doi}),
            headers: {'Content-type': 'application/json'}
        })
    }

    return(
        <Button label='Download' disabled={props.disabled} onClick={downloadDataset} style={{marginLeft: '30px'}}/>
    );
}

export default DownloadDatasetButton;