import React from 'react';
import {InputText} from 'primereact/inputtext';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 14px; 
    label {
        white-space: nowrap;
        margin-right: 10px;
    }
`;

const StyledInputText = styled(InputText)`
    flex-grow: 1;
`;

const CustomInputText = (props) => {
    const {label, id, className, name, placeholder, value, onChange, disabled} = props;
    return(
        <Container className={className}>
            <label>{label}</label>
            <StyledInputText 
                id={id} 
                name={name}
                placeholder={placeholder}
                value={value} 
                onChange={onChange}
                disabled={disabled} 
            />
        </Container>
    );
}

export default CustomInputText;