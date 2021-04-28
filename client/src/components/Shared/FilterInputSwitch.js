import React from 'react';
import {InputSwitch} from 'primereact/inputswitch';
import styled from 'styled-components';

const FilterSet = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 30px;
    label{
        margin-right: 10px;
        font-weight: bold;
    }
`;

const FilterInputSwitch = (props) => {
    const { label, checked, tooltip, onChange, disabled } = props;
    
    return(
        <FilterSet>
            <label>{label}</label> 
            <InputSwitch checked={checked} tooltip={tooltip} onChange={onChange} disabled={disabled} />
        </FilterSet>
    );
}

export default FilterInputSwitch;