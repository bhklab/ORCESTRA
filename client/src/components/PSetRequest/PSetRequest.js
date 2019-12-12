import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
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
            genome: {},
            drugSensitivity: {},
            datatype: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            name: '',
            email: '',
            formData: {},
            toolVersionOptions: [],
            rnaRefOptions: [],
            dnaRefOptions: [],
            hideRNARef: false,
            hideDNARef: false,
            notReadyToSubmit: false,
            isModalVisible: false,
            disableModalBtn: true
        }
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.getReqData = this.getReqData.bind(this);
        
        this.updateParameterSelection = this.updateParameterSelection.bind(this);
        this.updateReqInputEvent = this.updateReqInputEvent.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.setToolRefState = this.setToolRefState.bind(this);
        this.processAPIRequest = this.processAPIRequest.bind(this);
        this.initializeState = this.initializeState.bind(this);
        
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
    }

    componentDidMount(){
        if(this.context.authenticated){
            this.setState({email: this.context.username});
        }
        fetch('/formdata')  
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    formData: resData[0],
                    toolVersionOptions: resData[0].rnaToolVersionOptions.concat(resData[0].dnaToolVersionOptions),
                    rnaRefOptions: resData[0].rnaToolRefOptions,
                    dnaRefOptions: resData[0].dnaToolRefOptions
                });
            }   
    );
    }

    getReqData(){
        // return({
        //     dataset: {name: 'test', version: '2017', id: 'test-2017'},
        //     genome: {name: 'test'},
        //     drugSensitivity: {name: 'test'},
        //     datatype: [{name: 'test'}],
        //     toolVersion: [{name: 'test', datatype: 'RNA'}],
        //     rnaToolRef: [{name: 'test', genome: 'test'}],
        //     dnaToolRef: [{name: 'test', genome: 'test'}],
        //     name: 'test pset',
        //     email: 'user2@email.com'
        // });
        return({
            dataset: this.state.dataset,
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
        APICalls.requestPSet(this.getReqData(), (status, data) => {
            APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
        });
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.hideModal, this.messages);
    }

    updateParameterSelection = event => {
        event.preventDefault();
        console.log(event.value);
        this.setState({
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(this.getReqData()),
            [event.target.id]: event.value
        }, () => {
            if(event.target.id === 'datatype'){
                this.setToolVersionState(event, () => {
                    this.processAPIRequest();
                });
            }else if(event.target.id ==='genome'){
                this.setToolRefState(() => {
                    this.processAPIRequest();
                });
            }else{
                this.processAPIRequest();
            }
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
                    toolVersionOptions: this.state.formData.rnaToolVersionOptions,
                    hideDNARef: true,
                    toolVersion: tools,
                    dnaToolRef: []
                }, callback);
            }else{
                tools = tools.filter((tool)=>{return(tool.datatype==='DNA')}); 
                this.setState({
                    toolVersionOptions: this.state.formData.dnaToolVersionOptions, 
                    hideRNARef: true,
                    toolVersion: tools,
                    rnaToolRef: []
                }, callback);
            }
        }else{
            this.setState({
                toolVersionOptions: this.state.formData.rnaToolVersionOptions.concat(this.state.formData.dnaToolVersionOptions),
                hideDNARef: false,
                hideRNARef: false
            }, callback);
        }
    }

    setToolRefState(callback){
        let dnaRef = this.state.dnaToolRef;
        let rnaRef = this.state.rnaToolRef;
        dnaRef = dnaRef.filter((ref) => {return(ref.genome === this.state.genome.name)});
        rnaRef = rnaRef.filter((ref) => {return(ref.genome === this.state.genome.name)});
        this.setState({
            dnaToolRef: dnaRef,
            rnaToolRef: rnaRef,
            dnaRefOptions: this.state.formData.dnaToolRefOptions.filter((ref) => {return(ref.genome === this.state.genome.name)}),
            rnaRefOptions: this.state.formData.rnaToolRefOptions.filter((ref) => {return(ref.genome === this.state.genome.name)})
        }, callback);
    }

    processAPIRequest(){
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
    }

    initializeState(){
        this.setState({
            queryResult: [],
            selectedPSets: [],
            dataset: {},
            genome: {},
            drugSensitivity: {},
            datatype: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            name: '',
            email: '',
            toolVersionOptions: this.state.formData.rnaToolVersionOptions.concat(this.state.formData.dnaToolVersionOptions),
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
            disableModalBtn: true
        });
    }

    updatePSetSelection(value){
        this.setState({selectedPSets: value}, () => {
            if(APIHelper.isSelected(this.state.selectedPSets)){
                this.setState({disableModalBtn: false});
            }else{
                this.setState({disableModalBtn: true});
            }
        });
    }

    render(){
        const availablePSetModalLink = ( 
            <PSetRequestModal visible={this.state.isModalVisible} show={this.showModal} hide={this.hideModal} 
                tableValue={this.state.queryResult} selectedValue={this.state.selectedPSets}
                disableBtn={this.state.disableModalBtn} onSelectionChange={this.updatePSetSelection} onComplete={this.showMessage}
            />
        );

        const formData = this.state.formData;

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
                                    parameterOptions={formData.datatypeOptions} selectedParameter={this.state.datatype} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='dataset' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Dataset:' 
                                    parameterOptions={formData.datasetOptions} selectedParameter={this.state.dataset} handleUpdateSelection={this.updateParameterSelection} dataset={true}/>
                                <PSetParamOptions id='genome' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Genome:' 
                                    parameterOptions={formData.genomeOptions} selectedParameter={this.state.genome} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='drugSensitivity' className='reqInputSet' isHidden={false} selectOne={true} parameterName='Drug Sensitivity:' 
                                    parameterOptions={formData.drugSensitivityOptions} selectedParameter={this.state.drugSensitivity} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='toolVersion' className='reqInputSet' isHidden={false} parameterName='Tool + Version:' 
                                    parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.toolVersion} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='rnaToolRef' className='reqInputSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Reference:' 
                                    parameterOptions={this.state.rnaRefOptions} selectedParameter={this.state.rnaToolRef} handleUpdateSelection={this.updateParameterSelection} />
                                <PSetParamOptions id='dnaToolRef' className='reqInputSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Reference:' 
                                    parameterOptions={this.state.dnaRefOptions} selectedParameter={this.state.dnaToolRef} handleUpdateSelection={this.updateParameterSelection} />
                                
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