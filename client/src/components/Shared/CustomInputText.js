import React from 'react';
import {InputText} from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
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
    .button-class {
        margin-left: 10px;
    }
    img {
        margin-right: 10px;
        width: 20px; /* Adjust based on your needs */
        height: 20px; /* Adjust based on your needs */
    }
`;

const StyledInputText = styled(InputText)`
    flex-grow: 1;
`;

const CustomInputText = (props) => {
    const {label, id, className, name, placeholder, value, onChange, disabled, tooltip, icon, onButtonClick} = props;
    return(
        <Container className={className}>
            <label>{label}</label>
            {icon && 
            <img 
            src={icon} 
            alt="icon" 
            className="custom-target-icon"
            data-pr-tooltip={tooltip}
            data-pr-position="right"
            data-pr-at="right+5 top"
            data-pr-my="left center-2"
            style={{ cursor: 'pointer' }}
            />
            }
            <StyledInputText 
                id={id} 
                name={name}
                placeholder={placeholder}
                value={value} 
                onChange={onChange}
                disabled={disabled} 
            />
            <Tooltip target=".custom-target-icon" />
            {props.children} 
        </Container>
    );
}

export default CustomInputText;