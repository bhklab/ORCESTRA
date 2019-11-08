import React from 'react';
import './PSetRequest.css';
import Navigation from '../Navigation/Navigation';
import * as FormData from '../FormData';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import * as QueryHelper from '../PSetQueryHelper';
import PSetRequestParameterSelection from './PSetRequestParameterSelection';

class PSetRequest extends React.Component{
    
    constructor(){
        super();
        this.state = {
            queryResult: [],
            reqDataset: [],
            reqDatasetVersion: [],
            reqGenome: [],
            reqDrugSensitivity: [],
            reqDatatype: [],
            reqToolVersion: [],
            reqRNAToolRef: [],
            reqEmail: ''
        }
        this.updateParameterSelection = this.updateParameterSelection.bind(this);
        this.queryPSet = this.queryPSet.bind(this);
        this.evaluateParameterInput = this.evaluateParameterInput.bind(this);
        this.isNoneSelected = this.isNoneSelected.bind(this);
        this.displayPSetLink = this.displayPSetLink.bind(this);
    }

    updateParameterSelection = event => {
        event.preventDefault();
        this.setState({[event.target.id]: event.value}, () => {
            var filterset = QueryHelper.getFilterSet(null, this.state.reqGenome, this.state.reqToolVersion, this.state.reqDataset, this.state.reqDatasetVersion);
            console.log(filterset);
            var apiStr = QueryHelper.buildAPIStr(filterset);
            console.log(apiStr);
            this.queryPSet(apiStr);
        });
    }

    queryPSet(api){
        console.log(api);
        fetch(api)  
            .then(res => res.json())
            .then(resData => this.setState({queryResult: resData}));
    }

    evaluateParameterInput(){
        if(this.isNoneSelected()){
            this.state.queryResult = [];
            return(0)
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
                                <div className='reqInputSet'>
                                    <label>Dataset:</label>
                                    <MultiSelect id='reqDataset' className='reqInput' optionLabel='name' 
                                        value={this.state.reqDataset} 
                                        options={FormData.datasetOptions} onChange={this.updateParameterSelection}
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Dataset Version:</label>
                                    <MultiSelect id='reqDatasetVersion' className='reqInput' optionLabel='name' 
                                        value={this.state.reqDatasetVersion} 
                                        options={FormData.dataVersionOptions} onChange={this.updateParameterSelection} 
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    /> 
                                </div>

                                <div className='reqInputSet'>
                                    <label>Genome:</label>
                                    <MultiSelect id='reqGenome' className='reqInput' optionLabel='name'
                                        value={this.state.reqGenome} 
                                        options={FormData.genomeOptions} onChange={this.updateParameterSelection}
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Drug Sensitivity:</label>
                                    <MultiSelect id='reqDrugSensitivity' className='reqInput' optionLabel='name'
                                        value={this.state.reqDrugSensitivity} 
                                        options={FormData.drugSensitivityOptions} onChange={this.updateParameterSelection}
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>
                                
                                <div className='reqInputSet'>
                                    <label>Datatype:</label>
                                    <MultiSelect id='reqDatatype' className='reqInput' optionLabel='name'
                                        value={this.state.reqDatatype} 
                                        options={FormData.datatypeOptions} onChange={this.updateParameterSelection}
                                        filter={false} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Tool + Version:</label>
                                    <MultiSelect id='reqToolVersion' className='reqInput' optionLabel='name' 
                                        value={this.state.reqToolVersion} 
                                        options={FormData.toolVersionOptions} onChange={this.updateParameterSelection}
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>

                                <div className='reqInputSet'>
                                    <label>RNA Tool Reference:</label>
                                    <MultiSelect id='reqRNAToolRef' className='reqInput' optionLabel='name' 
                                        value={this.state.reqRNAToolRef} 
                                        options={FormData.rnaToolRefOptions} onChange={this.updateParameterSelection}
                                        filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate}
                                    />
                                </div>

                                <div className='reqInputSet'>
                                    <label>Email to receive DOI:</label>
                                    <InputText className='reqInput' value={this.state.value} onChange={(e) => this.setState({value: e.target.value})} />
                                </div>

                                <Button label='Submit Request' />
                            </form>
                        </div>
                        <div className='requestSelectionSummary'>
                            <div className='psetAvailability'>
                                <h3>Available PSets with Your Parameter Selection</h3>
                                <div className='psetAvail'>
                                    <span className='pSetNum'>{this.state.queryResult.length ? this.evaluateParameterInput() : '0'}</span> 
                                    {this.state.queryResult.length == 1 && !this.isNoneSelected() ? 'match' : 'matches' } found.
                                    <span className='pSetAvailLink'>{ this.state.queryResult.length && !this.isNoneSelected() ? this.displayPSetLink() : '' }</span>
                                </div>
                                
                            </div>
                            <div className='requestProfile'>
                                <h3>Your Parameter Selection</h3>
                                <div className='parameterSelectionContainer'>
                                    <PSetRequestParameterSelection parameterName='Dataset' parameter={this.state.reqDataset} />
                                    <PSetRequestParameterSelection parameterName='Dataset Version' parameter={this.state.reqDatasetVersion} />
                                    <PSetRequestParameterSelection parameterName='Genome' parameter={this.state.reqGenome} /> 
                                    <PSetRequestParameterSelection parameterName='Drug Sensitivity' parameter={this.state.reqDrugSensitivity} />
                                    <PSetRequestParameterSelection parameterName='Datatype' parameter={this.state.reqDatatype} />
                                    <PSetRequestParameterSelection parameterName='Tool + Version' parameter={this.state.reqToolVersion} />
                                    <PSetRequestParameterSelection parameterName='RNA Tool Ref.' parameter={this.state.reqRNAToolRef} />    
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