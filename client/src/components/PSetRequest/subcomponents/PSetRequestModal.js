import React from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import SavePSetButton from '../../Shared/Buttons/SavePSetButton';
//import DownloadPSetButton from '../../Shared/Buttons/DownloadPSetButton';
import PSetTable from '../../Shared/PSetTable';
import '../PSetRequest.css';

class PSetRequestModal extends React.Component {   
    render(){                       
        const footer = (
            <React.Fragment>
                <div>
                    <span style={{float: 'left'}}><SavePSetButton selectedPSets={this.props.selectedValue} disabled={this.props.disableBtn} onSaveComplete={this.props.onComplete} /></span>
                    {/* <DownloadPSetButton selectedPSets={this.props.selectedValue} disabled={this.props.disableBtn} onDownloadComplete={this.props.onComplete} />  */}
                    <Button className='modalCancelBtn' label='Cancel' onClick={this.props.hide} />
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