import React from 'react';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import CustomInputText from '../Shared/CustomInputText';
import CustomSelect from '../Shared/CustomSelect';

const StyledFormContainer = styled.div`
    display: flex;
    aling-items: center;
    flex-wrap: wrap;
    margin-left: 10px;
    margin-bottom: 10px;
    .datatype {
        margin-right: 10px;
    }
    .filename {
        width: 300px;
        margin-right: 10px;
    }
    .repo-url {
        width: 500px;
    }
    .publication-input {
        width: 500px;
        margin-right: 10px;
    }
    .button-field {
        .btn {
            margin-left: 10px;
        }
    }
`;

const MolecularDataForm = (props) => {
    const { 
        length,
        index, 
        molecularData, 
        handleInputChange,
        handleAddClick,
        handleRemoveClick 
    } = props;

    return(
        <StyledFormContainer>
            <CustomSelect 
                className='datatype'
                label='Data Type:'
                name='name'
                value={molecularData.name} 
                options={[]}
                onChange={(e) => {handleInputChange(e, index, 'name')}}
                selectOne={true}
            />
            <CustomInputText 
                className='filename'
                label='Filename:'
                name='filename'
                value={molecularData.filename} 
                onChange={(e) => {handleInputChange(e, index, 'filename')}}
            />
            <CustomInputText 
                className='repo-url'
                label='Repository URL:'
                name='repoURL'
                value={molecularData.repoURL} 
                onChange={(e) => {handleInputChange(e, index, 'repoURL')}}
            />
            <div className='button-field'>
                { 
                    index > 0 && 
                    <Button 
                        icon='pi pi-times' 
                        tooltip='Remove' 
                        className='btn p-button-danger'
                        onClick={(e) => {handleRemoveClick(e, index)}}
                    /> 
                }
                { 
                    index === length - 1 && 
                    <Button 
                        icon='pi pi-plus' 
                        tooltip='Add another molecular profile' 
                        className='btn'
                        onClick={handleAddClick}
                    /> 
                }
                <Button icon='pi pi-replay' tooltip='Reset' className='btn p-button-secondary' />
            </div>
        </StyledFormContainer>
    );
}

export default MolecularDataForm;