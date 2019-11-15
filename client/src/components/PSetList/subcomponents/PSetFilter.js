import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from 'primereact/button';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as FormData from '../../Shared/FormData';
import PSetParamOptions from '../../Shared/PSetParamOptions/PSetParamOptions';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            autoUpdateChecked: false,
            datatypeSelected: [],
            datasetSelected: [],
            versionSelected: [],
            genomeSelected: [],
            toolVersionSelected: [],
            rnaToolRefSelected: [],
            dnaToolRefSelected: [],
            toolVersionOptions: FormData.rnaToolVersionOptions.concat(FormData.dnaToolVersionOptions),
            hideRNARef: false,
            hideDNARef: false
        }
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.handleDatatypeSelectionChange = this.handleDatatypeSelectionChange.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
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
            var tools = this.state.toolVersionSelected;
            if(this.state.datatypeSelected[0].name === 'RNA'){
                tools = tools.filter((tool)=>{return(tool.datatype==='RNA')});              
                this.setState({
                    toolVersionOptions: FormData.rnaToolVersionOptions,
                    hideDNARef: true,
                    toolVersionSelected: tools,
                    dnaToolRefSelected: []
                }, callback);
            }else{
                tools = tools.filter((tool)=>{return(tool.datatype==='DNA')}); 
                this.setState({
                    toolVersionOptions: FormData.dnaToolVersionOptions, 
                    hideRNARef: true,
                    toolVersionSelected: tools,
                    rnaToolRefSelected: []
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
        var filterset = APIHelper.getFilterSet(
            this.state.datatypeSelected, 
            this.state.genomeSelected, 
            this.state.toolVersionSelected, 
            this.state.datasetSelected, 
            this.state.versionSelected,
            null,
            this.state.rnaToolRefSelected,
            this.state.dnaToolRefSelected
        );
        console.log(filterset);
        var apiStr = APIHelper.buildAPIStr(filterset);
        this.props.filterPSet(apiStr);
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

                    <PSetParamOptions id='datatypeSelected' className='filterSet' isHidden={false} parameterName='Datatype:' 
                        parameterOptions={FormData.datatypeOptions} selectedParameter={this.state.datatypeSelected} handleUpdateSelection={this.handleDatatypeSelectionChange} />

                    <PSetParamOptions id='datasetSelected' className='filterSet' isHidden={false} parameterName='Dataset:' 
                        parameterOptions={FormData.datasetOptions} selectedParameter={this.state.datasetSelected} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='versionSelected' className='filterSet' isHidden={false} parameterName='Dataset Version:' 
                        parameterOptions={FormData.dataVersionOptions} selectedParameter={this.state.versionSelected} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='genomeSelected' className='filterSet' isHidden={false} parameterName='Genome:' 
                        parameterOptions={FormData.genomeOptions} selectedParameter={this.state.genomeSelected} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='toolVersionSelected' className='filterSet' isHidden={false} parameterName='Tool + Version:' 
                        parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.toolVersionSelected} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='rnaToolRefSelected' className='filterSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Ref:' 
                        parameterOptions={FormData.rnaToolRefOptions} selectedParameter={this.state.rnaToolRefSelected} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='dnaToolRefSelected' className='filterSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Ref:' 
                        parameterOptions={FormData.dnaToolRefOptions} selectedParameter={this.state.dnaToolRefSelected} handleUpdateSelection={this.handleFilterChange} />

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;