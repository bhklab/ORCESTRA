import React from 'react';
import './PSetList.css';
import Navigation from '../Navigation/Navigation'
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';

class PSetList extends React.Component{
    constructor(){
        super();
        this.state = {
            users: [],
            datasetSelected: null,
            versionSelected: []
        }

        this.onDatasetChange = this.onDatasetChange.bind(this);
        this.onVersionChange = this.onVersionChange.bind(this);
    }

    // template for the dropdown options
    dataTemplate(option) {
        return (
            <div className="">
                <span style={{fontSize:'1em',margin:'1em .5em 0 0'}}>{option.name}</span>
            </div>
        );
    }

    // template for the selected options
    selectedDataTemplate(item) {
        if (item) {
            return (
                <div className="my-multiselected-item-token">
                    <span>{item.name}</span>
                </div>
            );
        }
        else {
            return <span>Choose from options</span>
        }
    }

    onDatasetChange(e){
        this.setState({datasetSelected: e.value});
    }

    onVersionChange(e){
        this.setState({versionSelected: e.value});
    }
    
	componentDidMount(){
		fetch('/pset')  
            .then(res => res.json())
            .then(users => this.setState({users}));
    }

    result(params){
        console.log(params);
    }
    
    render(){
        const datasetOptions = [
            {name: 'Leuk AML'},
            {name: 'Leuk Cell line'}
        ];
        
        const dataVersionOptions = [
            {name: '1.1'},
            {name: '2.2'},
            {name: '3.3'},
            {name: '4.4'},
            {name: '5.5'}
        ];

        const genomeOptions = [
            {name: 'GRCh38'},
            {name: 'GRCh37'}
        ];

        const datatypeOptions = [
            {name: 'RNA'},
            {name: 'DNA'}
        ];

        const toolVersionOptions = [
            {name: 'Tool 1 version 1.1'},
            {name: 'Tool 2 version 2.1'},
            {name: 'Tool 3 version 3.1'},
            {name: 'Tool 4 version 4.1'}
        ];
        
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>PSetList Page</h1>
                    <div className='pSetListContainer'>
                        <div className='pSetFilter'>
                            <h2>PSet Filter</h2>

                            <label>Dataset:</label>
                            <MultiSelect id='select-dataset' className='inputSelect' optionLabel='name' 
                                value={this.state.datasetSelected} 
                                options={datasetOptions} onChange={this.onDatasetChange} 
                                filter={true} itemTemplate={this.dataTemplate} selectedItemTemplate={this.selectedDataTemplate} 
                            />

                            <label>Version:</label>
                            <MultiSelect id='select-dataset-version' className='inputSelect' optionLabel='name' 
                                value={this.state.versionSelected} 
                                options={dataVersionOptions} onChange={this.onVersionChange} 
                                filter={true} itemTemplate={this.dataTemplate} selectedItemTemplate={this.selectedDataTemplate} 
                            />  
                        </div>
                        <div className='pSetTable'>
                            <h2>Users</h2>
                            {this.state.users.map(user =>
                                <div key={user.id}>{user.username}</div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PSetList;