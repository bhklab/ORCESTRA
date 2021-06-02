import React from 'react';
import {InputText} from 'primereact/inputtext';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 12px; 
    label {
        margin-right: 10px;
    }
`;

const StyledInputText = styled(InputText)`
    flex-grow: 1;
`;

const CustomInputText = (props) => {
    const {label, id, className, name, value, onChange, disabled} = props;
    return(
        <Container className={className}>
            <label>{label}</label>
            <StyledInputText 
                id={id} 
                name={name}
                value={value} 
                onChange={onChange}
                disabled={disabled} 
            />
        </Container>
    );
}

export default CustomInputText;