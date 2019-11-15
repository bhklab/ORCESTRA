import React from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

class PSetRequestModal extends React.Component {
    
    render(){                       
        const content = (
            <DataTable value={this.props.tableValue} selection={this.props.selectedValue} onSelectionChange={e => this.props.onSelectionChange(e.value)} scrollable={true} scrollHeight="200px">
                <Column selectionMode="multiple" style={{width:'3.5em'}}/>
                <Column className='textField' field='datasetName' header='Dataset' style={{width:'6em'}} />
                <Column className='textField' field='datasetVersion' header='Dataset Version' style={{width:'7em'}}/>
                <Column className='textField' field='drugSensitivity' header='Drug Sensitivity' style={{width:'7em'}}/>
                <Column className='textField' field='rnaTool' header='RNA Tool' style={{width:'10em'}} />
                <Column className='textField' field='exomeTool' header='Exome Tool' style={{width:'10em'}} />
                <Column className='textField' field='rnaRef' header='RNA Ref' style={{width:'10em'}} />
                <Column className='textField' field='exomeRef' header='Exome Ref' style={{width:'10em'}} />
            </DataTable>
        );

        const footer = (
                <div>
                    <Button label='Save' onClick={this.props.onSave} disabled={this.props.disableSaveBtn} />
                    <Button className='modalCancelBtn' label='Cancel' onClick={this.props.hide} />
                </div>
        );
        
        return(
            <React.Fragment>
                <Dialog header='Available PSets' visible={this.props.visible} onHide={this.props.hide} footer={footer} >
                    {content}
                </Dialog>
                <Button label='View available PSets' onClick={this.props.show} />
            </React.Fragment>
        );
    }
}

export default PSetRequestModal;