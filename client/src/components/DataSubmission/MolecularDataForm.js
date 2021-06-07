import React from 'react';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import CustomInputText from '../Shared/CustomInputText';
import CustomSelect from '../Shared/CustomSelect';

const StyledMolecularDataForm = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const StyledFormContainer = styled.div`
    display: flex;
    aling-items: center;
    flex-wrap: wrap;
    margin-left: 10px;
    margin-bottom: 10px;
    .datatype {
        margin-right: 20px;
    }
    .filename {
        width: 250px;
        margin-right: 20px;
    }
    .repo-url {
        width: 350px;
    }
`;

const StyledButtonField = styled.div`
    margin-left: 20px;
    .btn {
        margin-left: 10px;
    }
`;

const molecularDataOptions = [
    { label: 'RNA Sequence', value: 'rnaseq' },
    { label: 'Microarray', value: 'microarray' },
    { label: 'CNV', value: 'cnv' },
    { label: 'Fusion', value: 'fusion' },
    { label: 'Mutation', value: 'mutation' },
];

const MolecularDataForm = (props) => {
    const { 
        length,
        index, 
        molecularData, 
        handleInputChange,
        handleReset,
        handleAddClick,
        handleRemoveClick 
    } = props;

    return(
        <StyledMolecularDataForm>
            <div>
                <StyledFormContainer>
                    <CustomSelect 
                        className='datatype'
                        label='Data Type:'
                        name='name'
                        optionLabel='label'
                        selected={molecularData.name} 
                        options={molecularDataOptions}
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
                </StyledFormContainer>
                <StyledFormContainer>
                    <CustomInputText 
                        className='filename'
                        label='Processing Tool:'
                        name='filename'
                        value={molecularData.toolname}
                        onChange={(e) => {handleInputChange(e, index, 'toolname')}}
                    />
                    <CustomInputText 
                        className='filename'
                        label='Tool Version:'
                        name='filename'
                        value={molecularData.toolversion}
                        onChange={(e) => {handleInputChange(e, index, 'toolversion')}}
                    />
                </StyledFormContainer>
                <StyledFormContainer>
                    <CustomInputText 
                        className='filename'
                        label='Reference Filename:'
                        name='filename'
                        value={molecularData.refname}
                        onChange={(e) => {handleInputChange(e, index, 'refname')}}
                    />
                    <CustomInputText 
                        className='repo-url'
                        label='Repository URL:'
                        name='filename'
                        value={molecularData.refURL}
                        onChange={(e) => {handleInputChange(e, index, 'refURL')}}
                    />
                </StyledFormContainer>
            </div>
            <StyledButtonField>
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
                        disabled={molecularData.name.length === 0 || molecularData.filename.length === 0 || molecularData.repoURL.length === 0}
                    /> 
                }
                <Button 
                    icon='pi pi-replay' 
                    tooltip='Reset' 
                    className='btn p-button-secondary' 
                    onClick={(e) => {handleReset(e, index)}}
                />
            </StyledButtonField>
        </StyledMolecularDataForm>
    );
}

export default MolecularDataForm;