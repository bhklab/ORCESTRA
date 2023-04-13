import React, { useState } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import { Button } from 'primereact/button';
import AdditionalFields from './SubComponents/AdditionalFields';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

const StyledCreatePipeline = styled.div`
  max-width: 1000px;
  .textfield {
    max-width: 600px;
    margin-bottom: 10px;
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
    additional_repo: [],
    additional_parameters: []
  });
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
          <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
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