import React from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PSetTable from '../../Shared/PSetTable';
import {AuthContext} from '../../../context/auth';
import '../PSetRequest.css';

class PSetRequestModal extends React.Component {
    
    static contextType = AuthContext;
    
    render(){                       
        const footer = (
            <React.Fragment>
                <div>
                    <Button className='downloadBtn' label='Download' disabled={this.props.disableSaveBtn}/>
                    {this.context.authenticated ? <Button label='Save' onClick={this.props.onSave} disabled={this.props.disableSaveBtn} /> : ''}
                    <Button className='modalCancelBtn' label='Cancel' onClick={this.props.hide} />
                </div>
                <div className='modalFooterMessage'>
                    {this.context.authenticated ? '' : 'Login or register to select and save PSets to your profile.'}
                </div>
            </React.Fragment>
        );
        
        return(
            <React.Fragment>
                <Dialog header='Available PSets' visible={this.props.visible} onHide={this.props.hide} footer={footer} >
                    <PSetTable allData={this.props.tableValue} selectedPSets={this.props.selectedValue} updatePSetSelection={this.props.onSelectionChange} scrollHeight='600px'/>
                </Dialog>
                <Button label='View available PSets' onClick={this.props.show} />
            </React.Fragment>
        );
    }
}

export default PSetRequestModal;