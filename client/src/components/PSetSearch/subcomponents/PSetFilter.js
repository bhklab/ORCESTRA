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
            dataType: [],
            dataset: [],
            genome: [],
            rnaTool: [],
            rnaRef: [],
            dnaTool: [],
            dnaRef: [],

            formData: {},
            rnaRefOptions: [],
            dnaRefOptions: [],
            hideRNAToolRef: false,
            hideDNAToolRef: false
        }
        this.getSearchData = this.getSearchData.bind(this);
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.setToolState = this.setToolState.bind(this);
        this.setRefState = this.setRefState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
    }

    componentDidMount(){
        fetch('/formdata')  
            .then(res => res.json())
            .then(resData => {
                console.log(resData[0]);
                this.setState({
                    formData: resData[0],
                    rnaRefOptions: resData[0].rnaRef,
                    dnaRefOptions: resData[0].dnaRef
                });
            }); 
    }

    getSearchData(){
        return({
            dataset: this.state.dataset,
            genome: this.state.genome,
            dataType: this.state.dataType,
            rnaTool: this.state.rnaTool,
            dnaTool: this.state.dnaTool,
            rnaRef: this.state.rnaToolRef,
            dnaRef: this.state.dnaToolRef,
            drugSensitivity: null
        });
    }

    handleFilterChange = event => {
        event.preventDefault();
        this.setState({[event.target.id]: event.value}, () => {
            if(event.target.id === 'dataType'){
                this.setToolState(event, ()=>{
                    if(this.state.autoUpdateChecked){
                        this.sendFilterPSetRequest();
                    }
                }); 
            }else if(event.target.id === 'genome'){
                this.setRefState(event, () => {
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

    setToolState(event, callback){
        if(event.value.length === 1){
            if(this.state.dataType[0].name === 'RNA'){             
                this.setState({
                    hideDNAToolRef: true,
                    dnaTool: [],
                    dnaRef: []
                }, callback);
            }else{
                this.setState({
                    hideRNAToolRef: true,
                    rnaTool: [],
                    rnaRef: []
                }, callback);
            }
        }else{
            this.setState({
                hideDNAToolRef: false,
                hideRNAToolRef: false
            }, callback);
        }
    }

    setRefState(event, callback){
        console.log(event.value.length);
        if(event.value.length === 0){
            this.setState({
                dnaRefOptions: this.state.formData.dnaRef,
                rnaRefOptions: this.state.formData.rnaRef
            }, callback);
        }else{
            let dnaRef = this.state.dnaRef;
            let rnaRef = this.state.rnaRef;
            let genomeName = this.state.genome.map((genome) => {return(genome.name)});
            dnaRef = dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
            rnaRef = rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)});
            this.setState({
                dnaRef: dnaRef,
                rnaRef: rnaRef,
                dnaRefOptions: this.state.formData.dnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)}),
                rnaRefOptions: this.state.formData.rnaRef.filter((ref) => {return(genomeName.includes(ref.genome) && ref)})
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
        const formData = this.state.formData;
        
        return(
            <React.Fragment>
                <div className='pSetFilter'>
                    <h2>PSet Filter</h2>
                    <div className='filterSet'>
                        <label>Enable Automtic Table Update: </label>
                        <InputSwitch checked={this.state.autoUpdateChecked} onChange={(e) => this.setState({autoUpdateChecked: e.value})} />
                    </div>

                    <PSetParamOptions id='dataType' className='filterSet' isHidden={false} parameterName='Data Type:' 
                        parameterOptions={formData.dataType} selectedParameter={this.state.dataType} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='dataset' className='filterSet' isHidden={false} parameterName='Dataset:' 
                        parameterOptions={formData.dataset} selectedParameter={this.state.dataset} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='genome' className='filterSet' isHidden={false} parameterName='Genome:' 
                        parameterOptions={formData.genome} selectedParameter={this.state.genome} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='rnaTool' className='filterSet' isHidden={this.state.hideRNAToolRef} parameterName='RNA Tool:' 
                        parameterOptions={formData.rnaTool} selectedParameter={this.state.rnaTool} handleUpdateSelection={this.handleFilterChange} />

                    <PSetParamOptions id='rnaToolRef' className='filterSet' isHidden={this.state.hideRNAToolRef} parameterName='RNA Tool Ref:' 
                        parameterOptions={this.state.rnaRefOptions} selectedParameter={this.state.rnaToolRef} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='dnaTool' className='filterSet' isHidden={this.state.hideDNAToolRef} parameterName='DNA Tool:' 
                        parameterOptions={formData.dnaTool} selectedParameter={this.state.dnaTool} handleUpdateSelection={this.handleFilterChange} />
                    
                    <PSetParamOptions id='dnaToolRef' className='filterSet' isHidden={this.state.hideDNAToolRef} parameterName='DNA Tool Ref:' 
                        parameterOptions={this.state.dnaRefOptions} selectedParameter={this.state.dnaToolRef} handleUpdateSelection={this.handleFilterChange} />

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;