import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import * as Helper from '../../PSetQueryHelper';
import * as FormData from '../../FormData';
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
                            options={FormData.datatypeOptions} onChange={this.handleFilterChange} 
                            filter={false} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Genome:</label>
                        <MultiSelect id='genomeSelected' className='inputSelect' optionLabel='name'
                            value={this.state.genomeSelected} 
                            options={FormData.genomeOptions} onChange={this.handleFilterChange} 
                            filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Tool + Version:</label>
                        <MultiSelect id='toolVersionSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.toolVersionSelected} 
                            options={FormData.toolVersionOptions} onChange={this.handleFilterChange} 
                            filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Dataset:</label>
                        <MultiSelect id='datasetSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.datasetSelected} 
                            options={FormData.datasetOptions} onChange={this.handleFilterChange} 
                            filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Version:</label>
                        <MultiSelect id='versionSelected' className='inputSelect' optionLabel='name' 
                            value={this.state.versionSelected} 
                            options={FormData.dataVersionOptions} onChange={this.handleFilterChange} 
                            filter={true} itemTemplate={FormData.dataTemplate} selectedItemTemplate={FormData.selectedDataTemplate} 
                        /> 
                    </div>

                    <Button type='submit' label='Search' onClick={this.handleClick} disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;