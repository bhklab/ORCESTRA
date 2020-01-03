import React from 'react';
import PSetTable from '../../Shared/PSetTable';
import {Button} from 'primereact/button';
import DownloadPSetButton from '../../Shared/Buttons/DownloadPSetButton';
import {Dialog} from 'primereact/dialog';
import * as APIHelper from '../../Shared/PSetAPIHelper';
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
        this.showMessages = this.showMessages.bind(this);
    }

    handleSelectionChange(selected){
        this.setState({selectedPSets: selected}, () => {
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

    showMessages(status, data){
        APIHelper.messageAfterRequest(status, data, null, this.props.messages);
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

        const psetData = (
            <React.Fragment>
                <div>
                    <PSetTable allData={this.props.pset} selectedPSets={this.state.selectedPSets} updatePSetSelection={this.handleSelectionChange} scrollHeight='350px' pending={this.props.pending}/>
                </div>
                <div className='footer'>
                { this.props.pending ? '' : 
                    <DownloadPSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.btnDisabled} onDownloadComplete={this.showMessages}/>
                } 
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
                    <Dialog header={this.props.pending? 'Canceling PSet Request(s)' : 'Removing Pset(s)' } footer={dialogFooter} visible={this.state.dialogVisible} style={{width: '300px'}} modal={true} onHide={this.onHide}>
                        { this.props.pending ? 'Are you sure you would like to cancel the selected PSet request(s)?' : 'Are you sure you would like to remove the selected PSet(s) from the saved list?' }
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default UserPSet;