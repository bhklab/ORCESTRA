import React from 'react';
import CustomInputText from '../../Shared/CustomInputText';
import { Button } from 'primereact/button';
import styled from 'styled-components';

const StyledAdditionalField = styled.div`
  .header {
    width: 230px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .form-field {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .field1 {
      width: 500px;
      margin-right: 10px;
    }
    .delete-btn {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
`;

const AdditionalFields = (props) => {
  const {
    header,  
    fieldType,
    field1,
    pipeline, 
    addAdditionalField,  
    updateAdditionalField, 
    removeAdditionalField 
  } = props; 
  
  return(
    <StyledAdditionalField>
      <div className='header'>
        <h4>{header}</h4>
        {
          pipeline[fieldType].length === 0 &&
          <Button 
            icon='pi pi-plus' 
            onClick={addAdditionalField(fieldType)} 
          />
        }
      </div>
      <div>
        {
          pipeline[fieldType].map((field, i) => (
            <div key={i} className='form-field'>
              <CustomInputText 
                  className='field1'
                  label={field1.label}
                  placeholder='Ex. ./results'
                  value={field[field1.name]} 
                  onChange={updateAdditionalField(fieldType, i, field1.name)}
              />
              <Button 
                className='p-button-danger delete-btn'
                icon='pi pi-times' 
                onClick={removeAdditionalField(fieldType, i)} 
              />
              {
                i === pipeline[fieldType].length - 1 &&
                <Button 
                  icon='pi pi-plus' 
                  onClick={addAdditionalField(fieldType)} 
                />
              }
            </div>
          ))
        }
      </div>
    </StyledAdditionalField>
  )
}

export default AdditionalFields;