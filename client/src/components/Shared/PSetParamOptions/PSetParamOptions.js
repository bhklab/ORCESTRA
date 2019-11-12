import React from 'react';
import './PSetParamOptions.css';
import {dataTemplate, selectedDataTemplate} from '../FormData';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';

// props: id, className, isHidden, selectOne, parameterName, parameterOptions[], selecedParameter[], handleUpdateSelection()

class PSetRequestParamOptions extends React.Component {

    constructor(){
        super();

    }

    render(){
        if(this.props.isHidden){
            return(null);
        }
        if(this.props.selectOne){
            return(
                <div className={this.props.className}>
                    <label>{this.props.parameterName}</label>
                    <Dropdown id={this.props.id} className='paramInput' optionLabel='name' 
                        value={this.props.selectedParameter}   
                        options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                        filter={true} itemTemplate={dataTemplate}
                        placeholder="Select one..."
                    />
                </div>
            );
        }
        return(
            <div className={this.props.className}>
                <label>{this.props.parameterName}</label>
                <MultiSelect id={this.props.id} className='paramInput' optionLabel='name' 
                    value={this.props.selectedParameter} 
                    options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                    filter={true} itemTemplate={dataTemplate} selectedItemTemplate={selectedDataTemplate}
                />
            </div>
        );
    }
    
}

export default PSetRequestParamOptions;