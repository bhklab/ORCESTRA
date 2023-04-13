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
      width: 200px;
      margin-right: 30px;
    }
    .field2 {
      width: 400px;
      margin-right: 30px;
    }
    .delete-btn {
      margin-right: 10px;
    }
  }
`;

const AdditionalFields = (props) => {
  const {
    header,  
    fieldType,
    field1,
    field2,
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
                  value={field[field1.name]} 
                  onChange={updateAdditionalField(fieldType, i, field1.name)}
              />
              <CustomInputText 
                  className='field2'
                  label={field2.label}
                  value={field[field2.name]} 
                  onChange={updateAdditionalField(fieldType, i, field2.name)}
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