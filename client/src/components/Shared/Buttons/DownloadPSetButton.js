import React from 'react';
import {Button} from 'primereact/button';

const DownloadPSetButton = props => {

    const downloadPSet = async (event) => {
        event.preventDefault();
        
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', props.pset.downloadLink)
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        await fetch('/api/pset/download', {
            method: 'POST',
            body: JSON.stringify({psetID: props.pset.doi}),
            headers: {'Content-type': 'application/json'}
        })
    }

    return(
        <Button label='Download' disabled={props.disabled} onClick={downloadPSet} style={{marginLeft: '30px'}}/>
    );
}

export default DownloadPSetButton;