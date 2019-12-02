import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from 'primereact/button';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as APICalls from '../../Shared/APICalls';
import * as FormData from '../../Shared/FormData';
import PSetParamOptions from '../../Shared/PSetParamOptions/PSetParamOptions';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            autoUpdateChecked: false,
            datatype: [],
            dataset: [],
            datasetVersion: [],
            genome: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            toolVersionOptions: FormData.rnaToolVersionOptions.concat(FormData.dnaToolVersionOptions),
            hideRNARef: false,
            hideDNARef: false
        }
        this.getSearchData = this.getSearchData.bind(this);
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.handleDatatypeSelectionChange = this.handleDatatypeSelectionChange.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
    }

    getSearchData(){
        return({
            dataset: this.state.dataset,
            datasetVersion: this.state.datasetVersion,
            genome: this.state.genome,
            datatype: this.state.datatype,
            toolVersion: this.state.toolVersion,
            rnaToolRef: this.state.rnaToolRef,
            dnaToolRef: this.state.dnaToolRef,
            drugSensitivity: null
        });
    }

    handleFilterChange = event => {
        event.preventDefault();
        this.setState({[event.target.id]: event.value}, () => {
            if(this.state.autoUpdateChecked){
                this.sendFilterPSetRequest();
            }
        });  
    }

    handleDatatypeSelectionChange = event => {
        this.setState({[event.target.id]: event.value}, () => {
            this.setToolVersionState(event, ()=>{
                if(this.state.autoUpdateChecked){
                    this.sendFilterPSetRequest();
                }
            });   
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

    handleClick = event => {
        event.preventDefault();
        this.sendFilterPSetRequest();
    }

    sendFilterPSetRequest(){
        var filterset = APIHelper.getFilterSet(this.getSearchData());
        console.log(filterset);
        var apiStr = APIHelper.buildAPIStr(filterset);
        APICalls.queryPSet(apiStr, (data) => {
            this.props.updateAllData(data);
        });    
    }

    render(){
        return(
            <React.Fragment>
                <div className='pSetFilter'>
                    <h2>PSet Filter</h2>
                    <div className='filterSet'>
                        <label>Enable Automtic Table Update: </label>
                        <InputSwitch checked={this.state.autoUpdateChecked} onChange={(e) => this.setState({autoUpdateChecked: e.value})} />
                    </div>

                    <PSetParamOptions id='datatype' className='filterSet' isHidden={false} parameterName='Datatype:' 
                        parameterOptions={FormData.datatypeOptions} selectedParameter={this.state.datatype} handleUpdateSelection={this.handleDatatypeSelectionChange} />

                    <PSetParamOptions id='dataset' className='filterSet' isHidden={false} parameterName='Dataset:' 
                        parameterOptions={FormData.datasetOptions} selectedParameter={this.state.dataset} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='datasetVersion' className='filterSet' isHidden={false} parameterName='Dataset Version:' 
                        parameterOptions={FormData.dataVersionOptions} selectedParameter={this.state.datasetVersion} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='genome' className='filterSet' isHidden={false} parameterName='Genome:' 
                        parameterOptions={FormData.genomeOptions} selectedParameter={this.state.genome} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='toolVersion' className='filterSet' isHidden={false} parameterName='Tool + Version:' 
                        parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.toolVersion} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='rnaToolRef' className='filterSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Ref:' 
                        parameterOptions={FormData.rnaToolRefOptions} selectedParameter={this.state.rnaToolRef} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='dnaToolRef' className='filterSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Ref:' 
                        parameterOptions={FormData.dnaToolRefOptions} selectedParameter={this.state.dnaToolRef} handleUpdateSelection={this.handleFilterChange} />

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;