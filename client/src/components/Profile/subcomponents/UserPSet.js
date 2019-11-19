import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import './UserPSet.css';

class UserPSet extends React.Component{
    
    constructor(){
        super();
        this.state = {
            selectedPSets: [],
            btnDisabled: true,
            dialogVisible: false,
            btnYesDislabed: false
        }
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.onClickYes = this.onClickYes.bind(this);
        this.onHide = this.onHide.bind(this);
    }

    handleSelectionChange = event => {
        this.setState({selectedPSets: event.value}, () => {
            if(this.state.selectedPSets && this.state.selectedPSets.length > 0){
                this.setState({btnDisabled: false});
            }else{
                this.setState({btnDisabled: true});
            }
        });
    }

    handleBtnClick = event => {
        this.setState({dialogVisible: true});
    }

    onClickYes(){
        this.setState({
            btnDisabled: true,
            btnYesDislabed: true
        });
        this.props.handleBtnClick(this.state.selectedPSets, (err)=>{
            if(!err){
                this.setState({
                    selectedPSets: [],
                    dialogVisible: false,
                });
            }else{
                this.setState({btnDisabled: false});
            }   
        });
    }
    
    onHide(){
        this.setState({
            dialogVisible: false,
            btnYesDislabed: false
        });
    }
    
    render(){
        const psetDataComplete = (
            <DataTable value={this.props.pset} selection={this.state.selectedPSets} onSelectionChange={this.handleSelectionChange} scrollable={true} scrollHeight="350px">
                <Column selectionMode="multiple" style={{width:'3.5em'}}/>
                <Column className='textField' field='doi' header='DOI' style={{width:'15em'}}/>
                <Column className='textField' field='datasetName' header='Dataset' style={{width:'8em'}} />
                <Column className='textField' field='datasetVersion' header='Dataset Version' style={{width:'7em'}}/>
                <Column className='textField' field='drugSensitivity' header='Drug Sensitivity' style={{width:'7em'}}/>
                <Column className='textField' field='rnaTool' header='RNA Tool' style={{width:'10em'}} />
                <Column className='textField' field='exomeTool' header='Exome Tool' style={{width:'7em'}} />
                <Column className='textField' field='rnaRef' header='RNA Ref' style={{width:'20em'}} />
                <Column className='textField' field='exomeRef' header='Exome Ref' style={{width:'10em'}} />
                <Column className='textField' field='metadata' header='Metadata' />
            </DataTable>
        );
        
        const psetDataInProcess = (
            <DataTable value={this.props.pset} selection={this.state.selectedPSets} onSelectionChange={this.handleSelectionChange} scrollable={true} scrollHeight="350px">
                <Column selectionMode="multiple" style={{width:'3.5em'}}/>
                <Column className='textField' field='status' header='Status' style={{width:'10em'}}/>
                <Column className='textField' field='datasetName' header='Dataset' style={{width:'8em'}} />
                <Column className='textField' field='datasetVersion' header='Dataset Version' style={{width:'7em'}}/>
                <Column className='textField' field='drugSensitivity' header='Drug Sensitivity' style={{width:'7em'}}/>
                <Column className='textField' field='rnaTool' header='RNA Tool' style={{width:'10em'}} />
                <Column className='textField' field='exomeTool' header='Exome Tool' style={{width:'7em'}} />
                <Column className='textField' field='rnaRef' header='RNA Ref' style={{width:'20em'}} />
                <Column className='textField' field='exomeRef' header='Exome Ref' style={{width:'10em'}} />
                <Column className='textField' field='metadata' header='Metadata' />
            </DataTable>
        );

        const psetData = (
            <React.Fragment>
                <div>
                    {this.props.complete ? psetDataComplete : psetDataInProcess}
                </div>
                <div className='footer'>
                    <Button label={this.props.btnLabel} onClick={this.handleBtnClick} disabled={this.state.btnDisabled} />
                </div>
            </React.Fragment>
        );

        const noPSetData = (
            <p>No data available.</p>
        );

        const dialogFooter = (
            <div>
                <Button label="Yes" onClick={this.onClickYes} disabled={this.state.btnYesDislabed}/>
                <Button label="Cancel" onClick={this.onHide} />
            </div>
        );
        
        return(
            <div className='userPSet'>
                <h2>{this.props.heading}</h2>
                <div className='userPSetContent'>
                    {this.props.pset ? psetData : noPSetData}
                </div>
                <div>
                    <Dialog header={this.props.complete? 'Removing Pset(s)' : 'Canceling PSet Request(s)'} footer={dialogFooter} visible={this.state.dialogVisible} style={{width: '300px'}} modal={true} onHide={this.onHide}>
                        { this.props.complete ? 'Are you sure you would like to remove the selected PSet(s) from the saved list?' : 'Are you sure you would like to cancel the selected PSet request(s)?' }
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default UserPSet;