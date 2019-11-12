import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
import * as FormData from '../Shared/FormData';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import * as APIHelper from '../Shared/PSetAPIHelper';
import PSetRequestParameterSelection from './PSetRequestParameterSelection';
import PSetParamOptions from '../Shared/PSetParamOptions/PSetParamOptions';

class PSetRequest extends React.Component{
    
    constructor(){
        super();
        this.state = {
            queryResult: [],
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
            hideDNARef: false
        }
        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.updateParameterSelection = this.updateParameterSelection.bind(this);
        this.queryPSet = this.queryPSet.bind(this);
        this.evaluateParameterInput = this.evaluateParameterInput.bind(this);
        this.isNoneSelected = this.isNoneSelected.bind(this);
        this.displayPSetLink = this.displayPSetLink.bind(this);
        this.updateDatatypeSelectionEvent = this.updateDatatypeSelectionEvent.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
    }

    handleSubmitRequest = event => {
        event.preventDefault();
        fetch('/requestPset', {
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
            .then(resData => console.log('response: ' + resData.message))
            .catch(err => console.log('error: ' + err));
    }

    updateParameterSelection = event => {
        event.preventDefault();
        this.setState({[event.target.id]: event.value}, () => {
            var filterset = APIHelper.getFilterSet(null, this.state.reqGenome, this.state.reqToolVersion, this.state.reqDataset, this.state.reqDatasetVersion);
            console.log(filterset);
            var apiStr = APIHelper.buildAPIStr(filterset);
            console.log(apiStr);
            this.queryPSet(apiStr);
        });
    }

    updateDatatypeSelectionEvent = event => {
        this.setState({[event.target.id]: event.value}, () => {
            this.setToolVersionState(event, () => {
                console.log('RNARef:' + this.state.hideRNARef);
                console.log('DNARef:' + this.state.hideDNARef);
                var filterset = APIHelper.getFilterSet(null, this.state.reqGenome, this.state.reqToolVersion, this.state.reqDataset, this.state.reqDatasetVersion);
                console.log(filterset);
                var apiStr = APIHelper.buildAPIStr(filterset);
                console.log(apiStr);
                this.queryPSet(apiStr);
            });
        });   
    }

    setToolVersionState(event, callback){
        if(event.value.length === 1){
            if(this.state.reqDatatype[0].name === 'RNA'){
                this.setState({
                    toolVersionOptions: FormData.rnaToolVersionOptions,
                    hideDNARef: true
                }, callback);
            }else{
                this.setState({
                    toolVersionOptions: FormData.dnaToolVersionOptions, 
                    hideRNARef: true
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
            .then(resData => this.setState({queryResult: resData}));
    }

    evaluateParameterInput(){
        if(this.isNoneSelected()){
            this.setState({queryResult: []}, () => {
                return(0);
            });
        }else{
            return(this.state.queryResult.length);
        }   
    }

    isNoneSelected(){
        if((!this.state.reqDataset || !this.state.reqDataset.length) && 
            (!this.state.reqDatasetVersion || !this.state.reqDatasetVersion.length) && 
            (!this.state.reqDatatype || !this.state.reqDatatype.length) && 
            (!this.state.reqDrugSensitivity || !this.state.reqDrugSensitivity.length) && 
            (!this.state.reqGenome || !this.state.reqGenome.length) &&
            (!this.state.reqRNAToolRef || !this.state.reqRNAToolRef.length) &&
            (!this.state.reqToolVersion || !this.state.reqToolVersion.length)){
            return(true);
        }
        return(false);
    }

    displayPSetLink(){
        return(
            <span><a href='#'>View Available PSet(s)</a></span>
        );
    }
    
    render(){
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>Request Pipeline Analysis</h1>
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
                                    <InputText className='paramInput' value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
                                </div>

                                <Button label='Submit Request' type='submit' onClick={this.handleSubmitRequest}/>
                            </form>
                        </div>
                        <div className='requestSelectionSummary'>
                            <div className='psetAvailability'>
                                <h3>Available PSets with Your Parameter Selection</h3>
                                <div className='psetAvail'>
                                    <span className='pSetNum'>{this.state.queryResult.length ? this.evaluateParameterInput() : '0'}</span> 
                                    {this.state.queryResult.length === 1 && !this.isNoneSelected() ? 'match' : 'matches' } found.
                                    <span className='pSetAvailLink'>{ this.state.queryResult.length && !this.isNoneSelected() ? this.displayPSetLink() : '' }</span>
                                </div>
                            </div>
                            <div className='requestProfile'>
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