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
            body: JSON.stringify({psetID: props.pset._id}),
            headers: {'Content-type': 'application/json'}
        })
    }

    return(
        <Button className='downloadBtn' label='Download' disabled={props.disabled} onClick={downloadPSet} />
    );
}

export default DownloadPSetButton;