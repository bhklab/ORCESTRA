import React from 'react';
import {Button} from 'primereact/button';
import * as APICalls from '../APICalls';

class DownloadPSetButton extends React.Component{
    constructor(){
        super();
        this.downloadPSets = this.downloadPSets.bind(this);
    }

    downloadPSets = event => {
        event.preventDefault();
        APICalls.downloadPSets(this.props.selectedPSets, (status, data) => {
            this.props.onDownloadComplete(status, data);
        });
    }

    render(){
        return(
            <Button className='downloadBtn' label='Download' disabled={this.props.disabled} onClick={this.downloadPSets} />
        );
    }
}

export default DownloadPSetButton;