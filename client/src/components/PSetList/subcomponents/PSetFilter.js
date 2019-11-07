import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import * as Helper from '../PSetListHelper';
import './PSetFilter.css';

class PSetFilter extends React.Component {
    constructor(){
        super();
        this.state = {
            autoUpdateChecked: false,
            datatypeSelected: [],
            genomeSelected: [],
            toolVersionSelected: [],
            datasetSelected: [],
            versionSelected: []
        }
        this.handleFilterChange= this.handleFilterChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendFilterPSetRequest = this.sendFilterPSetRequest.bind(this);
    }

    handleFilterChange = event => {
        event.preventDefault();
        this.setState({[event.target.id]: event.value}, () => {
            console.log(event.target);
            if(this.state.autoUpdateChecked){
                this.sendFilterPSetRequest();
            }
        });  
    }

    handleClick = event => {
        event.preventDefault();
        this.sendFilterPSetRequest();
    }

    sendFilterPSetRequest(){
        var filterset = Helper.getFilterSet(null, this.state.genomeSelected, this.state.toolVersionSelected, this.state.datasetSelected, this.state.versionSelected);
        console.log(filterset);
        var apiStr = Helper.buildAPIStr(filterset);
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
                    <div className='filterSet'>
                        <label>Datatype:</label>
                        <MultiSelect id='datatypeSelected' className='inputSelect' optionLabel='name'
                            value={this.state.datatypeSelected} 
                            options={Helper.datatypeOptions} onChange={(e)=>this.setState({datatypeSelected: e.value})} 
                            filter={false} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Genome:</label>
                        <MultiSelect id='genomeSelected' className='inputSelect' optionLabel='name'
                            value={this.state.genomeSelected} 
                            options={Helper.genomeOptions} onChange={(e)=>this.setState({genomeSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Tool + Version:</label>
                        <MultiSelect id='toolVersionSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.toolVersionSelected} 
                            options={Helper.toolVersionOptions} onChange={(e)=>this.setState({toolVersionSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Dataset:</label>
                        <MultiSelect id='datasetSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.datasetSelected} 
                            options={Helper.datasetOptions} onChange={(e)=>this.setState({datasetSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Version:</label>
                        <MultiSelect id='versionSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.versionSelected} 
                            options={Helper.dataVersionOptions} onChange={this.handleFilterChange} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        /> 
                    </div>

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;