import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
import * as FormData from '../Shared/FormData';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import * as APIHelper from '../Shared/PSetAPIHelper';
import * as APICalls from '../Shared/APICalls';
import PSetRequestParameterSelection from './PSetRequestParameterSelection';
import PSetParamOptions from '../Shared/PSetParamOptions/PSetParamOptions';
import PSetRequestModal from './subcomponents/PSetRequestModal';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';

class PSetRequest extends React.Component{
    
    static contextType = AuthContext;
    
    constructor(){
        super();
        this.state = {
            queryResult: [],
            selectedPSets: [],
            dataset: {},
            datasetVersion: {},
            genome: {},
            drugSensitivity: {},
            datatype: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            name: '',
            email: '',
            toolVersionOptions: FormData.rnaToolVersionOptions.concat(FormData.dnaToolVersionOptions),
            hideRNARef: false,
            hideDNARef: false,
            notReadyToSubmit: true,
            isModalVisible: false,
            disableModalSaveBtn: true
        }
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.saveSelectedPSets = this.saveSelectedPSets.bind(this);
        this.afterSubmitRequest = this.afterSubmitRequest.bind(this);
        this.getReqData = this.getReqData.bind(this);
        
        this.updateParameterSelection = this.updateParameterSelection.bind(this);
        this.updateDatatypeSelectionEvent = this.updateDatatypeSelectionEvent.bind(this);
        this.updateReqInputEvent = this.updateReqInputEvent.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.initializeState = this.initializeState.bind(this);
        
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
    }

    componentDidMount(){
        if(this.context.authenticated){
            this.setState({email: this.context.username});
        }
    }

    getReqData(){
        return({
            dataset: this.state.dataset,
            datasetVersion: this.state.datasetVersion,
            genome: this.state.genome,
            drugSensitivity: this.state.drugSensitivity,
            datatype: this.state.datatype,
            toolVersion: this.state.toolVersion,
            rnaToolRef: this.state.rnaToolRef,
            dnaToolRef: this.state.dnaToolRef,
            name: this.state.name,
            email: this.state.email
        });
    }

    handleSubmitRequest = event => {
        event.preventDefault();
        APICalls.requestPSet(this.getReqData(), this.afterSubmitRequest);
    }

    afterSubmitRequest(success, resData){
        this.initializeState();
        if(success){
            this.messages.show({severity: 'success', summary: resData.summary, detail: resData.message});
        }else{
            this.messages.show({severity: 'error', summary: 'An error occured', detail: resData.toString(), sticky: true});
        }    
    }

    updateParameterSelection = event => {
        event.preventDefault();
        this.setState({notReadyToSubmit: APIHelper.isNotReadyToSubmit(this.getReqData())});
        this.setState({[event.target.id]: event.value}, () => {
            var filterset = APIHelper.getFilterSet(this.getReqData());
            if(!APIHelper.isNoneSelected(filterset)){
                var apiStr = APIHelper.buildAPIStr(filterset);
                console.log(apiStr);
                APICalls.queryPSet(apiStr, (resData) => {
                    this.setState({queryResult: resData});
                });
            }else{
                this.setState({queryResult: []});
            } 
        });
    }

    updateDatatypeSelectionEvent = event => {
        event.preventDefault();
        this.setState({notReadyToSubmit: APIHelper.isNotReadyToSubmit(this.getReqData())});
        this.setState({[event.target.id]: event.value}, () => {
            this.setToolVersionState(event, () => {
                var filterset = APIHelper.getFilterSet(this.getReqData());
                if(!APIHelper.isNoneSelected(filterset)){
                    var apiStr = APIHelper.buildAPIStr(filterset);
                    console.log(apiStr);
                    APICalls.queryPSet(apiStr, (resData) => {
                        this.setState({queryResult: resData});
                    });
                }else{
                    this.setState({queryResult: []});
                }
            });
        });   
    }

    updateReqInputEvent = event => {
        event.preventDefault();
        this.setState({
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(this.getReqData()),
            [event.target.id]: event.target.value
        });
    }

    setToolVersionState(event, callback){
        if(event.value.length === 1){
            var tools = this.state.toolVersion;
            if(this.state.datatype[0].name === 'RNA'){
                tools = tools.filter((tool)=>{return(tool.datatype==='RNA')});              
                this.setState({
                    toolVersionOptions: FormData.rnaToolVersionOptions,
                    hideDNARef: true,
                    toolVersion: tools,
                    dnaToolRef: []
                }, callback);
            }else{
                tools = tools.filter((tool)=>{return(tool.datatype==='DNA')}); 
                this.setState({
                    toolVersionOptions: FormData.dnaToolVersionOptions, 
                    hideRNARef: true,
                    toolVersion: tools,
                    rnaToolRef: []
                }, callback);
            }
        }else{
            this.setState({
                toolVersionOptions: FormData.rnaToolVersionOptions.concat(FormData.dnaToolVersionOptions),
                hideDNARef: false,
                hideRNARef: false
            }, callback);
        }
    }

    saveSelectedPSets = event => {
        event.preventDefault();
        if(this.context.authenticated){
            APICalls.saveOrUpdateUserPSets(this.context.username, this.state.selectedPSets, this.afterSubmitRequest);
        }
    }

    initializeState(){
        this.setState({
            queryResult: [],
            selectedPSets: [],
            dataset: {},
            datasetVersion: {},
            genome: {},
            grugSensitivity: {},
            gatatype: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            name: '',
            email: '',
            toolVersionOptions: FormData.rnaToolVersionOptions.concat(FormData.dnaToolVersionOptions),
            hideRNARef: false,
            hideDNARef: false,
            notReadyToSubmit: true,
            isModalVisible: false,
            disableModalSaveBtn: true
        });
    }

    showModal(){
        this.setState({isModalVisible: true});
    }
    
    hideModal(){
        this.setState({
            isModalVisible: false, 
            selectedPSets: [],
            disableModalSaveBtn: true
        });
    }

    updatePSetSelection(value){
        this.setState({selectedPSets: value}, () => {
            if(APIHelper.isSelected(this.state.selectedPSets)){
                this.setState({disableModalSaveBtn: false});
            }else{
                this.setState({disableModalSaveBtn: true});
            }
        });
    }

    render(){
        const availablePSetModalLink = ( 
            <PSetRequestModal 
                visible={this.state.isModalVisible} 
                show={this.showModal} 
                hide={this.hideModal} 
                tableValue={this.state.queryResult} 
                selectedValue={this.state.selectedPSets}
                disableSaveBtn={this.state.disableModalSaveBtn}
                onSelectionChange={this.updatePSetSelection}
                onSave={this.saveSelectedPSets}
            />
        );

        return(
            <React.Fragment>
                <Navigation routing={this.props}/>
                <div className='pageContent'>
                    <h1>Request Pipeline Analysis</h1>
                    <Messages ref={(el) => this.messages = el} />
                    <div className='psetRequest'>
                        <div className='psetRequestForm'>
                            <h3>Pipeline Analysis Request Form</h3>
                            <form>
                                <PSetParamOptions id='datatype' className='reqInputSet' isHidden={false} parameterName='Datatype:' 
                                    parameterOptions={FormData.datatypeOptions} selectedParameter={this.state.datatype} handleUpdateSelection={this.updateDatatypeSelectionEvent} />
                                <PSetParamOptions id='dataset' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Dataset:' 
                                    parameterOptions={FormData.datasetOptions} selectedParameter={this.state.dataset} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='datasetVersion' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Dataset Version:' 
                                    parameterOptions={FormData.dataVersionOptions} selectedParameter={this.state.datasetVersion} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='genome' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Genome:' 
                                    parameterOptions={FormData.genomeOptions} selectedParameter={this.state.genome} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='drugSensitivity' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Drug Sensitivity:' 
                                    parameterOptions={FormData.drugSensitivityOptions} selectedParameter={this.state.drugSensitivity} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='toolVersion' className='reqInputSet' isHidden={false} parameterName='Tool + Version:' 
                                    parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.toolVersion} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='rnaToolRef' className='reqInputSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Reference:' 
                                    parameterOptions={FormData.rnaToolRefOptions} selectedParameter={this.state.rnaToolRef} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='dnaToolRef' className='reqInputSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Reference:' 
                                    parameterOptions={FormData.dnaToolRefOptions} selectedParameter={this.state.dnaToolRef} handleUpdateSelection={this.updateParameterSelection} />
                                
                                <div className='reqInputSet'>
                                    <label>PSet Name:</label>
                                    <InputText id='name' className='paramInput' value={this.state.name || ''} onChange={this.updateReqInputEvent} />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Email to receive DOI:</label>
                                    <InputText id='email' className='paramInput' value={this.state.email || ''} onChange={this.updateReqInputEvent} />
                                </div>

                                <Button label='Submit Request' type='submit' onClick={this.handleSubmitRequest} disabled={this.state.notReadyToSubmit}/>
                            </form>
                        </div>
                        <div className='requestSelectionSummary'>
                            <div className='psetAvailability'>
                                <h3>Available PSets with Your Parameter Selection</h3>
                                <div className='psetAvail'>
                                    <span className='pSetNum'>{this.state.queryResult.length}</span> 
                                    {this.state.queryResult.length === 1 ? 'match' : 'matches' } found.
                                    <span className='pSetAvailLink'>{ this.state.queryResult.length ? availablePSetModalLink : '' }</span>
                                </div>
                            </div>
                            <div className='requestSummary'>
                                <h3>Your Parameter Selection</h3>
                                <div className='parameterSelectionContainer'>
                                    <PSetRequestParameterSelection parameterName='Datatype' parameter={this.state.datatype} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Dataset' parameter={this.state.dataset} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Dataset Version' parameter={this.state.datasetVersion} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Genome' parameter={this.state.genome} /> 
                                    <PSetRequestParameterSelection parameterName='Drug Sensitivity' parameter={this.state.drugSensitivity} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Tool + Version' parameter={this.state.toolVersion} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='RNA Tool Ref.' parameter={this.state.rnaToolRef} isHidden={this.state.hideRNARef} />  
                                    <PSetRequestParameterSelection parameterName='DNA Tool Ref.' parameter={this.state.dnaToolRef} isHidden={this.state.hideDNARef} />    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetRequest;