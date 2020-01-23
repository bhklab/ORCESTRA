import React from 'react';
import './PSetSearch.css';
import Navigation from '../Navigation/Navigation';
import PSetFilter from './subcomponents/PSetFilter';
import PSetTable from '../Shared/PSetTable';
import SavePSetButton from '../Shared/Buttons/SavePSetButton';
//import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Messages} from 'primereact/messages';
import {AuthContext} from '../../context/auth';
import * as APIHelper from '../Shared/PSetAPIHelper';
import * as APICalls from '../Shared/APICalls';

class PSetSearch extends React.Component{
    constructor(){
        super();
        this.state = {
            allData: [],
            formDataOriginal: {},
            formData: {},
            searchAll: true,
            selectedPSets: [],
            disableSaveBtn: true,
            isRequest: false,

            parameters: {
                dataType: [],
                dataset: [],
                drugSensitivity: [],
                genome: [],
                rnaTool: [],
                rnaRef: [],
                dnaTool: [],
                dnaRef: [],
                name: '',
                email: ''
            },

            notReadyToSubmit: true
        }

        this.updateAllData = this.updateAllData.bind(this);
        this.setStateOnParamSelection = this.setStateOnParamSelection.bind(this);
        // this.evaluateList = this.evaluateList.bind(this);
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
        this.initializeState = this.initializeState.bind(this);
        this.showMessage = this.showMessage.bind(this);
        
        this.setRequestView = this.setRequestView.bind(this);
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.updateReqInputEvent = this.updateReqInputEvent.bind(this);
        //this.setStateOnParamSelection = this.setStateOnParamSelection.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        APICalls.queryPSet('/pset', (resData) => {
            this.updateAllData(resData);
        });
        fetch('/formdata')  
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    formData: resData[0],
                    formDataOriginal: JSON.parse(JSON.stringify(resData[0]))
                });
            });
    }

    showMessage(status, data){
        APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
    }

    // evaluateList(list){
    //     if(list.length > 0){
    //         return(
    //             <ul>
    //                 {list.map((pset) => <li key={pset._id}>{pset.name}</li>)}
    //             </ul>
    //         );
    //     } else {
    //         return(<ul><li>None</li></ul>);
    //     }
    // }

    setStateOnParamSelection(states){
        let parameters = this.state.parameters;
        for(let i = 0; i < states.length; i++){
            parameters[states[i].name] = states[i].value;
        }
        console.log(parameters);
        this.setState({
            parameters: parameters,
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(parameters)
        });
    }

    updateAllData(data, searchAll = true){
        this.setState({
            allData: data,
            searchAll: searchAll
        });
    }

    updatePSetSelection(selected){
        this.setState({selectedPSets: selected}, () => {
            if(APIHelper.isSelected(this.state.selectedPSets)){
                this.setState({disableSaveBtn: false});
            }else{
                this.setState({disableSaveBtn: true});
            }
        });
    }

    setRequestView(visible){
        const parameters = this.state.parameters;
        let formData = this.state.formData;
        if(visible){
            if(parameters.dataset.length){
                formData.dataset = parameters.dataset;
                parameters.dataset = parameters.dataset[0];
            }
            if(parameters.genome.length){
                formData.genome = parameters.genome;
                parameters.genome = parameters.genome[0];
            }
        }else{
            console.log(parameters)
            if(formData.dataset.length < this.state.formDataOriginal.dataset.length){
                parameters.dataset = formData.dataset;
            }else if(!Array.isArray(parameters.dataset)){
                let datasetVal = JSON.parse(JSON.stringify(parameters.dataset));
                parameters.dataset = [];
                parameters.dataset.push(datasetVal);
            }
            if(formData.genome.length < this.state.formDataOriginal.genome.length){
                parameters.genome = formData.genome
            }else if(!Array.isArray(parameters.genome)){
                let genomeVal = JSON.parse(JSON.stringify(parameters.genome));
                parameters.genome = [];
                parameters.genome.push(genomeVal);
            }
            formData = this.state.formDataOriginal;
        }
        this.setState({
            parameters: parameters,
            formData: JSON.parse(JSON.stringify(formData)),
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(parameters),
            isRequest: visible
        });
    }

    initializeState(){
        this.setState({
            selectedPSets: [],
            disableSaveBtn: true
        });
    }

    handleSubmitRequest = event => {
        event.preventDefault();
        let reqData = this.state.parameters;
        reqData.drugSensitivity = reqData.dataset.drugSensitivity;
        APICalls.requestPSet(reqData, (status, data) => {
            APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
        });
    }

    updateReqInputEvent = event => {
        event.preventDefault();
        let parameters= this.state.parameters;
        parameters[event.target.id] = event.target.value;
        this.setState({
            parameters: parameters,
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(parameters)
        });
    }

    // setStateOnParamSelection(states){
    //     let parameters = this.state.reqData;
    //     for(let i = 0; i < states.length; i++){
    //         parameters[states[i].name] = states[i].value;
    //     }
    //     this.setState({
    //         reqData: parameters,
    //         notReadyToSubmit: APIHelper.isNotReadyToSubmit(parameters)
    //     });
    // }
    
    render(){  
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>Search or Request Pharmaco Datasets</h1>
                    <div className='pSetListContainer'>
                        <PSetFilter 
                            updateAllData={this.updateAllData} 
                            setRequestView={this.setRequestView} 
                            setParentState={this.setStateOnParamSelection}
                            isRequest={this.state.isRequest}
                            formData={this.state.formData} 
                            parameters={this.state.parameters}
                        />
                        <div className='pSetTable'>
                            <Messages ref={(el) => this.messages = el} />
                            <div className='pSetSelectionSummary'>
                                <div className='summaryPanel'>
                                    <h2>Summary</h2>
                                    <div className='pSetSummaryContainer'>
                                        <div className='pSetSummaryItem'>
                                            {
                                                this.state.searchAll ? 
                                                <span><span className='pSetSummaryNum'>{this.state.allData.length}</span> <span>dataset(s) available.</span></span>
                                                :
                                                <span><span className='pSetSummaryNum'>{this.state.allData.length}</span> <span>{this.state.allData.length === 1 ? ' match' : ' matches'}</span> found.</span>
                                            }
                                        </div>
                                        {/* <div className='pSetSummaryItem'>
                                            <span className='pSetSummaryNum'>{this.state.selectedPSets.length}</span> selected.
                                        </div> */}
                                    </div>
                                    <SavePSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableSaveBtn} onSaveComplete={this.showMessage} />
                                </div>
                                {
                                    this.state.isRequest &&
                                    <div className='requestFormPanel'>
                                        <h2>Request PSet</h2>
                                        <div className='reqFormInput'>
                                            <label>PSet Name:</label>
                                            <InputText id='name' className='paramInput' value={this.state.parameters.name || ''} onChange={this.updateReqInputEvent} />
                                        </div>
                                        <div className='reqFormInput'>
                                            <label>Email to receive DOI:</label>
                                            <InputText id='email' className='paramInput' value={this.state.parameters.email || ''} onChange={this.updateReqInputEvent} />
                                        </div>
                                        <div className='reqFormInput'>
                                            <Button label='Submit Request' type='submit' disabled={this.state.notReadyToSubmit} onClick={this.handleSubmitRequest}/>
                                        </div>
                                    </div>
                                }
                                
                                {/* <DownloadPSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableSaveBtn} onDownloadComplete={this.showMessage} /> */}
                            </div>
                            <PSetTable allData={this.state.allData} selectedPSets={this.state.selectedPSets} updatePSetSelection={this.updatePSetSelection} scrollHeight='600px'/>    
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetSearch;