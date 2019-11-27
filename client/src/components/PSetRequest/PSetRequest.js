import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
import * as FormData from '../Shared/FormData';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import * as APIHelper from '../Shared/PSetAPIHelper';
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
            reqDataset: {},
            reqDatasetVersion: {},
            reqGenome: {},
            reqDrugSensitivity: {},
            reqDatatype: [],
            reqToolVersion: [],
            reqRNAToolRef: [],
            reqDNAToolRef: [],
            reqEmail: '',
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
        this.queryPSet = this.queryPSet.bind(this);
        
        this.updateParameterSelection = this.updateParameterSelection.bind(this);
        this.updateDatatypeSelectionEvent = this.updateDatatypeSelectionEvent.bind(this);
        this.updateReqEmailInputEvent = this.updateReqEmailInputEvent.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.isNoneSelected = this.isNoneSelected.bind(this);
        this.isNotReadyToSubmit = this.isNotReadyToSubmit.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.isValidEmail = this.isValidEmail.bind(this);
        this.initializeState = this.initializeState.bind(this);
        
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
    }

    componentDidMount(){
        if(this.context.authenticated){
            this.setState({reqEmail: this.context.username});
        }
    }

    handleSubmitRequest = event => {
        event.preventDefault();
        this.notReadyToSubmit = true;
        fetch('/pset/request', {
            method: 'POST',
            body: JSON.stringify({
                reqData: {
                    reqDataset: this.state.reqDataset,
                    reqDatasetVersion: this.state.reqDatasetVersion,
                    reqGenome: this.state.reqGenome,
                    reqDrugSensitivity: this.state.reqDrugSensitivity,
                    reqDatatype: this.state.reqDatatype,
                    reqToolVersion: this.state.reqToolVersion,
                    reqRNAToolRef: this.state.reqRNAToolRef,
                    reqDNAToolRef: this.state.reqDNAToolRef,
                    reqEmail: this.state.reqEmail
                }   
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(resData => this.afterSubmitRequest(1, resData))
            .catch(err => this.afterSubmitRequest(0, err));
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
        this.setState({notReadyToSubmit: this.isNotReadyToSubmit()});
        this.setState({[event.target.id]: event.value}, () => {
            var filterset = APIHelper.getFilterSet(
                this.state.reqDatatype, 
                this.state.reqGenome, 
                this.state.reqToolVersion, 
                this.state.reqDataset, 
                this.state.reqDatasetVersion,
                this.state.reqDrugSensitivity,
                this.state.reqRNAToolRef,
                this.state.reqDNAToolRef
            );
            console.log(filterset);
            if(!this.isNoneSelected(filterset)){
                var apiStr = APIHelper.buildAPIStr(filterset);
                console.log(apiStr);
                this.queryPSet(apiStr);
            }else{
                this.setState({queryResult: []});
            } 
        });
    }

    updateDatatypeSelectionEvent = event => {
        event.preventDefault();
        this.setState({notReadyToSubmit: this.isNotReadyToSubmit()});
        this.setState({[event.target.id]: event.value}, () => {
            this.setToolVersionState(event, () => {
                var filterset = APIHelper.getFilterSet(
                    this.state.reqDatatype, 
                    this.state.reqGenome, 
                    this.state.reqToolVersion, 
                    this.state.reqDataset, 
                    this.state.reqDatasetVersion,
                    this.state.reqDrugSensitivity,
                    this.state.reqRNAToolRef,
                    this.state.reqDNAToolRef
                );
                console.log(filterset);
                if(!this.isNoneSelected(filterset)){
                    var apiStr = APIHelper.buildAPIStr(filterset);
                    console.log(apiStr);
                    this.queryPSet(apiStr);
                }else{
                    this.setState({queryResult: []});
                }
            });
        });   
    }

    updateReqEmailInputEvent = event => {
        event.preventDefault();
        this.setState({notReadyToSubmit: this.isNotReadyToSubmit()});
        this.setState({reqEmail: event.target.value});
    }

    setToolVersionState(event, callback){
        if(event.value.length === 1){
            var tools = this.state.reqToolVersion;
            if(this.state.reqDatatype[0].name === 'RNA'){
                tools = tools.filter((tool)=>{return(tool.datatype==='RNA')});              
                this.setState({
                    toolVersionOptions: FormData.rnaToolVersionOptions,
                    hideDNARef: true,
                    reqToolVersion: tools,
                    reqDNAToolRef: []
                }, callback);
            }else{
                tools = tools.filter((tool)=>{return(tool.datatype==='DNA')}); 
                this.setState({
                    toolVersionOptions: FormData.dnaToolVersionOptions, 
                    hideRNARef: true,
                    reqToolVersion: tools,
                    reqRNAToolRef: []
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

    queryPSet(api){
        fetch(api)  
            .then(res => res.json())
            .then(resData => this.setState({queryResult: resData}, ()=>{console.log(this.state.queryResult)}));
    }

    saveSelectedPSets = event => {
        if(this.context.authenticated){
            if(this.state.selectedPSets.length){
                var userPSet = { username: this.context.username };
                event.preventDefault();
                console.log(this.state.selectedPSets);
                var psetId = [];
                for(let i = 0; i < this.state.selectedPSets.length; i++){
                    psetId.push(this.state.selectedPSets[i]._id);
                }
                console.log(psetId);
                userPSet.psetId = psetId;

                fetch('/user/pset/add', {
                    method: 'POST',
                    body: JSON.stringify({reqData: userPSet}),
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(resData => this.afterSubmitRequest(1, resData))
                    .catch(err => this.afterSubmitRequest(0, err));

            }else{
                console.log('nothing to save');
            }
        }
    }

    isNoneSelected(filterset){
        if(!filterset.datatype.length && 
            !filterset.datasetName.length && 
            !filterset.datasetVersion.length && 
            !filterset.genome.length && 
            !filterset.rnaTool.length &&
            !filterset.exomeTool.length &&
            !filterset.rnaRef.length &&
            !filterset.exomeRef.length &&
            !filterset.drugSensitivity.length){
            return(true);
        }
        return(false);
    }

    isNotReadyToSubmit(){
        if(!this.isSelected(this.state.reqDatatype)){
            return(true);
        }else if(this.state.reqDatatype.length === 1){
            if(this.state.reqDatatype[0] === 'RNA' && !this.isSelected(this.state.reqRNAToolRef)){
                return(true);
            }else if(this.state.reqDatatype[0] === 'DNA' && !this.isSelected(this.state.reqDNAToolRef)){
                return(true);
            }
        }else{
            if(!this.isSelected(this.state.reqRNAToolRef)){
                return(true);
            }
            if(!this.isSelected(this.state.reqDNAToolRef)){
                return(true);
            }
        }

        if(!this.isSelected(this.state.reqGenome)){
            return(true);
        } 
        if(!this.isSelected(this.state.reqToolVersion)){
            return(true);
        } 
        if(!this.isSelected(this.state.reqDataset)){
            return(true);
        }
        if(!this.isSelected(this.state.reqDatasetVersion)){
            return(true);
        }
        if(!this.isSelected(this.state.reqDrugSensitivity)){
            return(true);
        }
        if(!this.isValidEmail(this.state.reqEmail)){
            return(true);
        }
        return(false);
    }

    isSelected(reqParam){
        if(typeof reqParam === 'undefined' || reqParam === null){
            return(false);
        }
        if(Array.isArray(reqParam) && !reqParam.length){
            return(false);
        }
        return(true);
    }

    isValidEmail(email){
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(typeof email === 'undefined' || email === null){
            return(false);
        }
        if(email.length === 0){
            return(false);
        }
        if(!regex.test(email)){
            return(false);
        }
        return(true);
    }

    initializeState(){
        this.setState({
            queryResult: [],
            selectedPSets: [],
            reqDataset: {},
            reqDatasetVersion: {},
            reqGenome: {},
            reqDrugSensitivity: {},
            reqDatatype: [],
            reqToolVersion: [],
            reqRNAToolRef: [],
            reqDNAToolRef: [],
            reqEmail: '',
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
            if(this.isSelected(this.state.selectedPSets)){
                this.setState({disableModalSaveBtn: false});
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
                                <PSetParamOptions id='reqDatatype' className='reqInputSet' isHidden={false} parameterName='Datatype:' 
                                    parameterOptions={FormData.datatypeOptions} selectedParameter={this.state.reqDatatype} handleUpdateSelection={this.updateDatatypeSelectionEvent} />
                                <PSetParamOptions id='reqDataset' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Dataset:' 
                                    parameterOptions={FormData.datasetOptions} selectedParameter={this.state.reqDataset} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqDatasetVersion' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Dataset Version:' 
                                    parameterOptions={FormData.dataVersionOptions} selectedParameter={this.state.reqDatasetVersion} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqGenome' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Genome:' 
                                    parameterOptions={FormData.genomeOptions} selectedParameter={this.state.reqGenome} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqDrugSensitivity' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Drug Sensitivity:' 
                                    parameterOptions={FormData.drugSensitivityOptions} selectedParameter={this.state.reqDrugSensitivity} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqToolVersion' className='reqInputSet' isHidden={false} parameterName='Tool + Version:' 
                                    parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.reqToolVersion} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqRNAToolRef' className='reqInputSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Reference:' 
                                    parameterOptions={FormData.rnaToolRefOptions} selectedParameter={this.state.reqRNAToolRef} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='reqDNAToolRef' className='reqInputSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Reference:' 
                                    parameterOptions={FormData.dnaToolRefOptions} selectedParameter={this.state.reqDNAToolRef} handleUpdateSelection={this.updateParameterSelection} />

                                <div className='reqInputSet'>
                                    <label>Email to receive DOI:</label>
                                    <InputText id='reqEmail' className='paramInput' value={this.state.reqEmail || ''} onChange={this.updateReqEmailInputEvent} />
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
                                    <PSetRequestParameterSelection parameterName='Datatype' parameter={this.state.reqDatatype} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Dataset' parameter={this.state.reqDataset} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Dataset Version' parameter={this.state.reqDatasetVersion} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Genome' parameter={this.state.reqGenome} /> 
                                    <PSetRequestParameterSelection parameterName='Drug Sensitivity' parameter={this.state.reqDrugSensitivity} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Tool + Version' parameter={this.state.reqToolVersion} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='RNA Tool Ref.' parameter={this.state.reqRNAToolRef} isHidden={this.state.hideRNARef} />  
                                    <PSetRequestParameterSelection parameterName='DNA Tool Ref.' parameter={this.state.reqDNAToolRef} isHidden={this.state.hideDNARef} />    
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