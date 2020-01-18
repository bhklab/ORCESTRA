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
        const psets = this.props.selectedPSets;
        
        const link = document.createElement('a');
        link.setAttribute('download', null);
        link.style.display = 'none';
        document.body.appendChild(link);
        for(let i = 0; i < psets.length; i++){
            if(psets[i].downloadLink){
                link.setAttribute('href', psets[i].downloadLink)
                link.click();
            } 
        }
        document.body.removeChild(link);

        APICalls.downloadPSets(this.props.selectedPSets, (status, data) => {
            //this.props.onDownloadComplete(status, data);
        });
    }

    render(){
        return(
            <Button className='downloadBtn' label='Download' disabled={this.props.disabled} onClick={this.downloadPSets} />
        );
    }
}

export default DownloadPSetButton;