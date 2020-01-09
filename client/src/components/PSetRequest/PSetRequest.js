import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import * as APIHelper from '../Shared/PSetAPIHelper';
import * as APICalls from '../Shared/APICalls';
import PSetRequestParameterSelection from './PSetRequestParameterSelection';
import PSetParameterOptions from '../Shared/PSetParameterOptions';
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

            reqData: {
                dataType: [],
                dataset: {},
                genome: {},
                drugSensitivity: {},
                rnaTool: [],
                dnaTool: [],
                rnaRef: [],
                dnaRef: [],
                name: '',
                email: ''
            },

            notReadyToSubmit: false,
            isModalVisible: false,
            disableModalBtn: true
        }
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.showMessage = this.showMessage.bind(this);
        
        this.setStateOnParamSelection = this.setStateOnParamSelection.bind(this);
        this.updateReqInputEvent = this.updateReqInputEvent.bind(this);
        
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
    }

    handleSubmitRequest = event => {
        event.preventDefault();
        APICalls.requestPSet(this.state.reqData, (status, data) => {
            APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
        });
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.hideModal, this.messages);
    }

    setStateOnParamSelection(states){
        let parameters = this.state.reqData;
        for(let i = 0; i < states.length; i++){
            parameters[states[i].name] = states[i].value;
        }
        this.setState({
            reqData: parameters,
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(parameters)
        });
    }

    updateReqInputEvent = event => {
        event.preventDefault();
        let reqData = this.state.reqData;
        reqData[event.target.id] = event.target.value;
        this.setState({
            reqData: reqData,
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(reqData)
        });
    }

    processAPIRequest(){
        var filterset = APIHelper.getFilterSet(this.state.reqData);
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
            
            reqData: {
                dataType: [],
                dataset: {},
                genome: {},
                drugSensitivity: {},
                rnaTool: [],
                dnaTool: [],
                rnaRef: [],
                dnaRef: [],
                name: '',
                email: ''
            },
            
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
                                <PSetParameterOptions 
                                    autoUpdate={true}
                                    setParentState={this.setStateOnParamSelection}
                                    requestUpdate={this.processAPIRequest}
                                    parameters={this.state.reqData}
                                    dropdownClassName='reqInputSet'
                                    selectOne={true}
                                    requestView={true}
                                />
                                
                                <div className='reqInputSet'>
                                    <label>PSet Name:</label>
                                    <InputText id='name' className='paramInput' value={this.state.reqData.name || ''} onChange={this.updateReqInputEvent} />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Email to receive DOI:</label>
                                    <InputText id='email' className='paramInput' value={this.state.reqData.email || ''} onChange={this.updateReqInputEvent} />
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
                                    <PSetRequestParameterSelection parameterName='Datatype' parameter={this.state.reqData.dataType} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Dataset' parameter={this.state.reqData.dataset} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Drug Sensitivity' parameter={this.state.reqData.drugSensitivity} isHidden={false} />
                                    <PSetRequestParameterSelection parameterName='Genome' parameter={this.state.reqData.genome} /> 
                                    <PSetRequestParameterSelection parameterName='RNA Tool.' parameter={this.state.reqData.rnaTool} isHidden={this.state.hideRNAToolRef} /> 
                                    <PSetRequestParameterSelection parameterName='RNA Ref.' parameter={this.state.reqData.rnaRef} isHidden={this.state.hideRNAToolRef} />  
                                    <PSetRequestParameterSelection parameterName='DNA Tool.' parameter={this.state.reqData.dnaTool} isHidden={this.state.hideRNAToolRef} /> 
                                    <PSetRequestParameterSelection parameterName='DNA Ref.' parameter={this.state.reqData.dnaRef} isHidden={this.state.hideDNAToolRef} />    
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