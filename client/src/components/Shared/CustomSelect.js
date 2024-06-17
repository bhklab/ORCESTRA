import React from 'react';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';
import styled from 'styled-components';

const FilterSet = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // margin-top: 20px;
    // margin-bottom: 20px;
    label {
        margin-right: 10px;
        font-size: 14px;
    }
    .dropdown {
        flex-grow: 1;
    }
    .item-token {
        padding-left: 3px;
        padding-right: 3px;
        margin-top: 2px;
        margin-left: 2px;
        margin-right: 2px;
        border-radius: 2px;
        background-color: #3D405A;
        color: #ffffff;
        font-weight: bold;
        font-size: 12px;
        display: block;
    }
`;

const FilterDropdown = (props) => {
    const { 
        id, 
        className,
        hidden, 
        selectOne, 
        label, 
        options, 
        selected, 
        onChange, 
        disabled 
    } = props;

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
                <div className="item-token">
                    <span>{item.label}</span>
                </div>
            );
        }
        else {
            return <span>Select...</span>
        }
    }

    if(hidden){
        return(null);
    }
    if(selectOne){
        return(
            <FilterSet className={className}>
                <label>{label}</label>
                <Dropdown 
                    id={id} 
                    className='dropdown' 
                    optionLabel='label' 
                    value={selected}   
                    options={options} 
                    onChange={onChange}
                    filter={true} 
                    itemTemplate={dataTemplate}
                    placeholder="Select one..."
                    disabled={disabled}
                />
            </FilterSet>
        );
    }
    return(
        <FilterSet className={className}>
            <label>{label}</label>
            <MultiSelect 
                id={id}
                className='dropdown' 
                optionLabel='label' 
                value={selected} 
                options={options} 
                onChange={onChange}
                filter={true} 
                itemTemplate={dataTemplate} 
                selectedItemTemplate={selectedDataTemplate}
                disabled={disabled}
            />
        </FilterSet>
    );
}

export default FilterDropdown;