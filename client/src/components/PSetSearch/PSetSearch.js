import React from 'react';
import './PSetSearch.css';
import Navigation from '../Navigation/Navigation';
import PSetFilter from './subcomponents/PSetFilter';
import PSetTable from '../Shared/PSetTable';
import SavePSetButton from '../Shared/Buttons/SavePSetButton';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
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
            searchAll: true,
            selectedPSets: [],
            disableSaveBtn: true,
            isRequest: false,

            searchData: {
                dataType: [],
                dataset: [],
                drugSensitivity: [],
                genome: [],
                rnaTool: [],
                rnaRef: [],
                dnaTool: [],
                dnaRef: [],
                drugSensitivity: null
            },

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
        let searchData = this.state.searchData;
        for(let i = 0; i < states.length; i++){
            searchData[states[i].name] = states[i].value;
        }
        console.log(searchData);
        this.setState({
            searchData: searchData,
            reqData: searchData,
            notReadyToSubmit: APIHelper.isNotReadyToSubmit(searchData)
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
        this.setState({
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
        APICalls.requestPSet(this.state.reqData, (status, data) => {
            APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
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
                            parameters={this.state.searchData}
                        />
                        <div className='pSetTable'>
                            <div className='pSetSelectionSummary'>
                                <div className='summaryPanel'>
                                    <h2>Summary</h2>
                                    <Messages ref={(el) => this.messages = el} />
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
                                            <InputText id='name' className='paramInput' value={this.state.reqData.name || ''} onChange={this.updateReqInputEvent} />
                                        </div>
                                        <div className='reqFormInput'>
                                            <label>Email to receive DOI:</label>
                                            <InputText id='email' className='paramInput' value={this.state.reqData.email || ''} onChange={this.updateReqInputEvent} />
                                        </div>
                                        <div className='reqFormInput'>
                                            <Button label='Submit Request' type='submit' disabled={this.state.notReadyToSubmit} />
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