import React from 'react';
import './PSetList.css';
import Navigation from '../Navigation/Navigation'
import {MultiSelect} from 'primereact/multiselect';

class PSetList extends React.Component{

    // template for the dropdown options
    cityTemplate(option) {
        return (
            <div className="p-clearfix">
                <span style={{fontSize:'1em',float:'right',margin:'1em .5em 0 0'}}>{option.name}</span>
            </div>
        );
    }

    // template for the selected options
    selectedCityTemplate(item) {
        if (item) {
            return (
                <div className="my-multiselected-item-token">
                    <span>{item.name}</span>
                </div>
            );
        }
        else {
            return <span>Choose</span>
        }
    }
    
    state = {
        users: [],
        citiesSelected: []
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
        const citiesOptions = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
        
        return(
            <React.Fragment>
                <Navigation />
                <div className='pageContent'>
                    <h1>PSetList Page</h1>
                    <div className='pSetListContainer'>
                        <div className='pSetFilter'>
                            <h2>PSet Filter</h2>
                            <MultiSelect className='inputSelect' optionLabel='name' value={this.state.citiesSelected} options={citiesOptions} onChange={(e) => this.setState({citiesSelected: e.value})} filter={true} itemTemplate={this.cityTemplate} selectedItemTemplate={this.selectedCityTemplate} />
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