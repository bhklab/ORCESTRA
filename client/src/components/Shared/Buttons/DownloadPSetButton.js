import React from 'react';
import {Button} from 'primereact/button';
import * as API from '../APICalls';

class DownloadPSetButton extends React.Component{
    constructor(){
        super();
        this.downloadPSet = this.downloadPSet.bind(this);
    }

    downloadPSet = event => {
        event.preventDefault();
        
        const pset = this.props.pset;
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', pset.downloadLink)
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        API.downloadPSet(pset._id);
    }

    render(){
        return(
            <Button className='downloadBtn' label='Download' disabled={this.props.disabled} onClick={this.downloadPSet} />
        );
    }
}

export default DownloadPSetButton;