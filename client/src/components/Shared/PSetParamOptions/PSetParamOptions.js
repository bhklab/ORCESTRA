import React from 'react';
import './PSetParamOptions.css';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';

// props: id, className, isHidden, selectOne, parameterName, parameterOptions[], selecedParameter[], handleUpdateSelection()

class PSetRequestParamOptions extends React.Component {
    
    render(){
        const dataTemplate =  (option) => {
            return(
                <div className="">
                    <span style={{fontSize:'1em',margin:'1em .5em 0 0'}}>{option.label}</span>
                </div>
            );
        }

        const selectedDataTemplate = (item) => {
            if (item) {
                return (
                    <div className="my-multiselected-item-token">
                        <span>{item.label}</span>
                    </div>
                );
            }
            else {
                return <span>Select...</span>
            }
        }
            
        if(this.props.isHidden){
            return(null);
        }
        if(this.props.selectOne){
            return(
                <div className={this.props.className}>
                    <label>{this.props.parameterName}</label>
                    <Dropdown 
                        id={this.props.id} 
                        className='paramInput' 
                        optionLabel='label' 
                        value={this.props.selectedParameter}   
                        options={this.props.parameterOptions} 
                        onChange={this.props.handleUpdateSelection}
                        filter={true} 
                        itemTemplate={dataTemplate}
                        placeholder="Select one..."
                    />
                </div>
            );
        }
        return(
            <div className={this.props.className}>
                <label>{this.props.parameterName}</label>
                <MultiSelect 
                    id={this.props.id}
                    className='paramInput' 
                    optionLabel='label' 
                    value={this.props.selectedParameter} 
                    options={this.props.parameterOptions} 
                    onChange={this.props.handleUpdateSelection}
                    filter={true} 
                    itemTemplate={dataTemplate} 
                    selectedItemTemplate={selectedDataTemplate}
                />
            </div>
        );
    }
    
}

export default PSetRequestParamOptions;