import React from 'react';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';
import styled from 'styled-components';

const FilterSet = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 30px;
    .paramInput {
        flex-grow: 1;
    }
`

// props: id, className, isHidden, selectOne, parameterName, parameterOptions[], selecedParameter[], handleUpdateSelection()
class PSetDropdown extends React.Component {
    
    render(){
        const dataTemplate =  (option) => {
            return(
                <div>
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
                <FilterSet>
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
                        disabled={this.props.disabled}
                    />
                </FilterSet>
            );
        }
        return(
            <FilterSet>
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
                    disabled={this.props.disabled}
                />
            </FilterSet>
        );
    }
    
}

export default PSetDropdown;