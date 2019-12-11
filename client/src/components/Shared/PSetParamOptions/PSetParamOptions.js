import React from 'react';
import './PSetParamOptions.css';
import {dataTemplate, datasetTemplate, selectedDataTemplate, selectedDatasetTemplate} from '../FormData';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';

// props: id, className, isHidden, selectOne, parameterName, parameterOptions[], selecedParameter[], handleUpdateSelection()

class PSetRequestParamOptions extends React.Component {

    render(){
        if(this.props.isHidden){
            return(null);
        }
        if(this.props.selectOne){
            return(
                <div className={this.props.className}>
                    <label>{this.props.parameterName}</label>
                    {this.props.dataset ? 
                        <Dropdown id={this.props.id} className='paramInput' optionLabel='id' 
                            value={this.props.selectedParameter}   
                            options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                            filter={true} itemTemplate={datasetTemplate}
                            placeholder="Select one..."
                        />
                        :
                        <Dropdown id={this.props.id} className='paramInput' optionLabel='name' 
                            value={this.props.selectedParameter}   
                            options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                            filter={true} itemTemplate={dataTemplate}
                            placeholder="Select one..."
                        />
                    }
                </div>
            );
        }
        return(
            <div className={this.props.className}>
                <label>{this.props.parameterName}</label>
                {this.props.dataset ? 
                    <MultiSelect id={this.props.id} className='paramInput' optionLabel='id' 
                        value={this.props.selectedParameter} 
                        options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                        filter={true} itemTemplate={datasetTemplate} selectedItemTemplate={selectedDatasetTemplate}
                    />
                    :
                    <MultiSelect id={this.props.id} className='paramInput' optionLabel='name' 
                        value={this.props.selectedParameter} 
                        options={this.props.parameterOptions} onChange={this.props.handleUpdateSelection}
                        filter={true} itemTemplate={dataTemplate} selectedItemTemplate={selectedDataTemplate}
                    />
                }
            </div>
        );
    }
    
}

export default PSetRequestParamOptions;