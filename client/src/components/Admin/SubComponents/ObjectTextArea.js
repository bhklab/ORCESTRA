import React from "react";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import styled from 'styled-components';

const StyledTextArea = styled.div`
  .submit-button {
    display: flex;
    align-items: center;
    button {
      margin-right: 10px;
    }
    .object-id {
      font-size: 14px;
    }
  }
`;

const ObjectTextArea = (props) => {
  const { title, submit, object, setObject, rows, cols, } = props;
  return(
    <StyledTextArea>
      <h4>{title}</h4>
      <div>
        <InputTextarea 
          value={object.text} 
          onChange={(e) => setObject({...object, text: e.target.value})} 
          rows={rows} 
          cols={cols} 
          style={{whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'scroll', fontFamily: 'monospace'}}
        />
        <div className='submit-button'>
          <Button 
            label='Submit' 
            onClick={submit} 
          />
          {
            object.id.length > 0 &&
            <div className='object-id'>ID: {object.id}</div>
          }
        </div>
      </div>
   </StyledTextArea>
  )
}

export default ObjectTextArea;