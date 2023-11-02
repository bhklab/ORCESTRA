import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import AdditionalFields from './SubComponents/AdditionalFields';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';

const StyledCreatePipeline = styled.div`
  max-width: 1000px;
  .textfield {
    max-width: 600px;
    margin-bottom: 10px;
  }
  .radio-buttons {
    display: flex;
    margin-bottom: 20px;
    font-size: 12px;
    .radio-button-field {
      margin-right: 20px;
      .radio-button-label {
        margin-left: 5px;
      }
    }
  }
  .multiple-file-field {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    max-width: 600px;
    .multiple-file-textfield {
      margin-right: 10px;
    }
    .delete-btn {
      margin-right: 10px;
    }
  }
  .additional-fields {
    margin-left: 10px;
  }
  .submit-button {
    margin-top: 30px;
  }
`;

const creationSuccessMessage = {
  severity: 'success', 
  summary: 'Pipeline Created', 
  detail: '', 
  sticky: true 
}

const creationErrorMessage = {
  severity: 'error', 
  summary: 'Pipeline Not Created', 
  detail: '', 
  sticky: true 
}

const CreatePipeline = () => {
  const [pipeline, setPipeline] = useState({
    name: "",
    git_url: "",
    dvc_git: "",
    object_name: "",
    object_names: [''],
    additional_repo: [],
    additional_parameters: []
  });
  const [numFiles, setNumFiles] = useState('single');
  const [submitting, setSubmitting] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({});

  const addAdditionalField = (field) => (e) => {
    let newItem = { repo_type: '', git_url: '' };
    if(field === 'additional_parameters'){
      newItem = { name: '', value: '' };
    }
    let fields = [...pipeline[field]];
    fields.push(newItem);
    setPipeline({
      ...pipeline, 
      [field]: fields
    })
  }

  const updateAdditionalField = (fieldType, index, field) => (e) => {
    let fields = [...pipeline[fieldType]];
    fields[index][field] = e.target.value;
    setPipeline({...pipeline, [fieldType]: fields});
  }

  const removeAdditionalField = (fieldType, index) => (e) => {
    let fields = [...pipeline[fieldType]];
    fields.splice(index, 1);
    setPipeline({...pipeline, [fieldType]: fields});
  }

  const addFilename = (e) => {
    let names = [...pipeline.object_names];
    names.push('');
    setPipeline({
      ...pipeline, 
      object_names: names
    });
  }

  const updateFilename = (index) => (e) => {
    let names = [...pipeline.object_names];
    names[index] = e.target.value;
    setPipeline({
      ...pipeline, 
      object_names: names
    });
  }

  const removeFilename = (index) => (e) => {
    let names = [...pipeline.object_names];
    names.splice(index, 1);
    setPipeline({
      ...pipeline, 
      object_names: names
    });   
  }

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let message = '';
    try{
      const res = await axios.post(
        '/api/admin/data-processing/create-pipeline',
        pipeline
      )
      console.log(res.data);
      if(res.data.status === 'ok'){
        setSubmitMessage({...creationSuccessMessage, detail: res.data.message});
      }else{
        message = res.data.message;
        if(res.data.warnings){
          message = message + ', ' + res.data.warnings.join(', ');
        }
        setSubmitMessage({...creationErrorMessage, detail: message});
      }
    }catch(error){
      setSubmitMessage({...creationErrorMessage, detail: 'An error occurred'});
    }finally{
      setSubmitting(false);
      setShowMsg(Math.random());
    }
  }
   
  return(
    <StyledCreatePipeline>
      <CustomMessages trigger={showMsg} message={submitMessage} />
      <h3>Create a Pipeline</h3>
      <CustomInputText 
          className='textfield'
          label='Piepline Name:'
          value={pipeline.name} 
          onChange={(e) => {setPipeline({...pipeline, name: e.target.value})}}
      />
      <CustomInputText 
          className='textfield'
          label='Pipeline Git URL:'
          value={pipeline.git_url} 
          onChange={(e) => {setPipeline({...pipeline, git_url: e.target.value})}}
      />
      <CustomInputText 
          className='textfield'
          label='DVC Git URL:'
          value={pipeline.dvc_git} 
          onChange={(e) => {setPipeline({...pipeline, dvc_git: e.target.value})}}
      />
      <div>
        <h4>File Name(s)</h4>
        <div className="radio-buttons">
          <div className="radio-button-field flex align-items-center">
            <RadioButton inputId="filename-single" name="filename" value="single" checked={numFiles === 'single'} onChange={(e) => {setNumFiles(e.value)}} />
            <label htmlFor="filename-single" className="radio-button-label">Single File</label>
          </div>
          <div className="radio-button-field flex align-items-center">
            <RadioButton inputId="filename-multiple" name="filename" value="multiple" checked={numFiles === 'multiple'} onChange={(e) => {setNumFiles(e.value)}} />
            <label htmlFor="filename-multiple" className="radio-button-label">Multiple Files</label>
          </div>
        </div>
        {
          numFiles === 'single' &&
          <CustomInputText 
            className='textfield'
            label='File name:'
            value={pipeline.object_name} 
            onChange={(e) => {setPipeline({...pipeline, object_name: e.target.value})}}
          />
        }
        {
          numFiles === 'multiple' &&
              pipeline.object_names.map((name, i) => (
                <div className='multiple-file-field' key={i}>
                  <CustomInputText 
                    className='multiple-file-textfield'
                    label='File name:'
                    value={name} 
                    onChange={updateFilename(i)}
                  />
                  {
                    i > 0 &&
                    <Button 
                      className='p-button-danger delete-btn'
                      icon='pi pi-times' 
                      onClick={removeFilename(i)} 
                    />
                  }
                  <Button 
                    icon='pi pi-plus' 
                    onClick={addFilename} 
                  />
                </div>
              ))
        }
      </div>
      <div className='additional-fields'>
        <AdditionalFields 
          header='Additional Repositories'
          fieldType='additional_repo'
          field1={{label: 'Repo Type:', name: 'repo_type'}}
          field2={{label: 'Git URL:', name: 'git_url'}}
          pipeline={pipeline}
          addAdditionalField={addAdditionalField}
          updateAdditionalField={updateAdditionalField}
          removeAdditionalField={removeAdditionalField}
        />
        <AdditionalFields 
          header='Additional Parameters'
          fieldType='additional_parameters'
          field1={{label: 'Name:', name: 'name'}}
          field2={{label: 'Value:', name: 'value'}}
          pipeline={pipeline}
          addAdditionalField={addAdditionalField}
          updateAdditionalField={updateAdditionalField}
          removeAdditionalField={removeAdditionalField}
        />
      </div>
      <div className='submit-button'>
        {
          submitting ?
          <ThreeDots color="#3D405A" height={100} width={100} />
          :
          <Button 
            label='Create Pipeline' 
            onClick={submit} 
          />
        }
      </div>
    </StyledCreatePipeline>
  )
}

export default CreatePipeline;