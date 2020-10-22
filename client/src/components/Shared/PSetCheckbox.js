import React from 'react';
import {Checkbox} from 'primereact/checkbox';
import styled from 'styled-components';

const CheckBoxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .label{
        margin-right: 10px;
    }
`

const PSetCheckbox = (props) => {
    return(
        <CheckBoxContainer>
            <div className='label'>{props.label}</div>
            <Checkbox inputId="filteredSens" 
                onChange={props.onChange} 
                checked={props.checked}>
            </Checkbox>
        </CheckBoxContainer>
    );
}

export default PSetCheckbox;
