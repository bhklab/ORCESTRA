import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from 'primereact/button';
import * as APIHelper from '../../Shared/PSetAPIHelper';
import * as APICalls from '../../Shared/APICalls';
import PSetParamOptions from '../../Shared/PSetParamOptions/PSetParamOptions';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            autoUpdateChecked: false,
            datatype: [],
            dataset: [],
            genome: [],
            toolVersion: [],
            rnaToolRef: [],
            dnaToolRef: [],
            formData: {},
            toolVersionOptions: [],
            rnaRefOptions: [],
            dnaRefOptions: [],
            hideRNARef: false,
            hideDNARef: false
        }
        this.getSearchData = this.getSearchData.bind(this);
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.handleDatatypeSelectionChange = this.handleDatatypeSelectionChange.bind(this);
        this.setToolVersionState = this.setToolVersionState.bind(this);
        this.setToolRefState = this.setToolRefState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
    }

    componentDidMount(){
        fetch('/formdata')  
            .then(res => res.json())
            .then(resData => {
                this.setState({
                    formData: resData[0],
                    toolVersionOptions: resData[0].rnaToolVersionOptions.concat(resData[0].dnaToolVersionOptions),
                    rnaRefOptions: resData[0].rnaToolRefOptions,
                    dnaRefOptions: resData[0].dnaToolRefOptions
                });
            }); 
    }

    getSearchData(){
        return({
            dataset: this.state.dataset,
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
            if(event.target.id === 'datatype'){
                this.setToolVersionState(event, ()=>{
                    if(this.state.autoUpdateChecked){
                        this.sendFilterPSetRequest();
                    }
                }); 
            }else if(event.target.id === 'genome'){
                this.setToolRefState(() => {
                    if(this.state.autoUpdateChecked){
                        this.sendFilterPSetRequest();
                    }
                })
            }else{
                if(this.state.autoUpdateChecked){
                    this.sendFilterPSetRequest();
                }
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
        let genomeName = this.state.genome.map((genome) => {return(genome.name)});
        dnaRef = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
        rnaRef = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
        this.setState({
            dnaToolRef: dnaRef,
            rnaToolRef: rnaRef,
            dnaRefOptions: this.state.formData.dnaToolRefOptions.filter((ref) => {return(genomeName.includes(ref.genome) && ref)}),
            rnaRefOptions: this.state.formData.rnaToolRefOptions.filter((ref) => {return(genomeName.includes(ref.genome) && ref)})
        }, callback);
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
        const formData = this.state.formData;
        
        return(
            <React.Fragment>
                <div className='pSetFilter'>
                    <h2>PSet Filter</h2>
                    <div className='filterSet'>
                        <label>Enable Automtic Table Update: </label>
                        <InputSwitch checked={this.state.autoUpdateChecked} onChange={(e) => this.setState({autoUpdateChecked: e.value})} />
                    </div>

                    <PSetParamOptions id='datatype' className='filterSet' isHidden={false} parameterName='Datatype:' 
                        parameterOptions={formData.datatypeOptions} selectedParameter={this.state.datatype} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='dataset' className='filterSet' isHidden={false} parameterName='Dataset:' 
                        parameterOptions={formData.datasetOptions} selectedParameter={this.state.dataset} handleUpdateSelection={this.handleFilterChange} dataset={true}/>
                    
                    <PSetParamOptions id='genome' className='filterSet' isHidden={false} parameterName='Genome:' 
                        parameterOptions={formData.genomeOptions} selectedParameter={this.state.genome} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='toolVersion' className='filterSet' isHidden={false} parameterName='Tool + Version:' 
                        parameterOptions={this.state.toolVersionOptions} selectedParameter={this.state.toolVersion} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='rnaToolRef' className='filterSet' isHidden={this.state.hideRNARef} parameterName='RNA Tool Ref:' 
                        parameterOptions={this.state.rnaRefOptions} selectedParameter={this.state.rnaToolRef} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='dnaToolRef' className='filterSet' isHidden={this.state.hideDNARef} parameterName='DNA Tool Ref:' 
                        parameterOptions={this.state.dnaRefOptions} selectedParameter={this.state.dnaToolRef} handleUpdateSelection={this.handleFilterChange} />

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;