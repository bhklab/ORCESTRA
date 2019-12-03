import React from 'react';
import {Button} from 'primereact/button';
import {AuthContext} from '../../../context/auth';
import * as APICalls from '../APICalls';

class SavePSetButton extends React.Component{
    constructor(){
        super();
        this.saveSelectedPSets = this.saveSelectedPSets.bind(this);
    }

    static contextType = AuthContext;

    saveSelectedPSets = event => {
        event.preventDefault();
        if(this.context.authenticated){
            APICalls.saveOrUpdateUserPSets(this.context.username, this.props.selectedPSets, (status, data) => {this.props.onSaveComplete(status, data)});
        }
    }

    render(){
        return(
            this.context.authenticated ? <Button label='Save' onClick={this.saveSelectedPSets} disabled={this.props.disabled}/> : '*Login or register to save existing PSets to your profile.'
        );
    }
}

export default SavePSetButton;
