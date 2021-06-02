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
        .left {
            margin-left: 10px;
            margin-right: 10px;
        }
    }
`;

const MolecularDataForm = (props) => {
    const { index, molecularData, handleInputChange } = props;

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
                { index === 0 && <Button icon='pi pi-plus' className='left'/> }
                { index > 0 && <Button icon='pi pi-times' className='left p-button-danger'/> }
                <Button label='Reset' />
            </div>
        </StyledFormContainer>
    );
}

export default MolecularDataForm;