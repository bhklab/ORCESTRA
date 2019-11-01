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
                        <MultiSelect id='select-datatype' className='inputSelect' optionLabel='name'
                            value={this.state.datatypeSelected} 
                            options={Helper.datatypeOptions} onChange={(e)=>this.setState({datatypeSelected: e.value})} 
                            filter={false} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Genome:</label>
                        <MultiSelect id='select-genome' className='inputSelect' optionLabel='name'
                            value={this.state.genomeSelected} 
                            options={Helper.genomeOptions} onChange={(e)=>this.setState({genomeSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Tool + Version:</label>
                        <MultiSelect id='select-tool-version' className='inputSelect' optionLabel='name' 
                            value={this.state.toolVersionSelected} 
                            options={Helper.toolVersionOptions} onChange={(e)=>this.setState({toolVersionSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Dataset:</label>
                        <MultiSelect id='select-dataset' className='inputSelect' optionLabel='name' 
                            value={this.state.datasetSelected} 
                            options={Helper.datasetOptions} onChange={(e)=>this.setState({datasetSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        />
                    </div>

                    <div className='filterSet'>
                        <label>Version:</label>
                        <MultiSelect id='select-dataset-version' className='inputSelect' optionLabel='name' 
                            value={this.state.versionSelected} 
                            options={Helper.dataVersionOptions} onChange={(e)=>this.setState({versionSelected: e.value})} 
                            filter={true} itemTemplate={Helper.dataTemplate} selectedItemTemplate={Helper.selectedDataTemplate} 
                        /> 
                    </div>

                    <Button label='Search' disabled={this.state.autoUpdateChecked}/>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetFilter;