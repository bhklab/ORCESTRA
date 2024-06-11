import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import AdditionalFields from './SubComponents/AdditionalFields';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import * as MainStyle from '../Main/MainStyle';

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
    margin-bottom: 30px;
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
    path_snakefile: "",
    path_output: "",
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
          placeholder='Ex. PSet_GRAY2013 or PSet_UHNBreast'
          label='Pipeline Name:'
          value={pipeline.name} 
          onChange={(e) => {setPipeline({...pipeline, name: e.target.value})}}
      />
      <CustomInputText 
          className='textfield'
          placeholder='Ex. https://github.com/BHKLAB-DataProcessing/RADCURE_radiomics.git'
          label='Pipeline Git URL:'
          value={pipeline.git_url} 
          onChange={(e) => {setPipeline({...pipeline, git_url: e.target.value})}}
      />
      <CustomInputText 
          className='textfield'
          placeholder='Ex. ./snake'
          label='Path to snakefile:'
          value={pipeline.path_snakefile} 
          onChange={(e) => {setPipeline({...pipeline, path_snakefile: e.target.value})}}
      />
      <CustomInputText 
          className='textfield'
          placeholder='Ex. ./results'
          label='Path to output:'
          value={pipeline.path_output} 
          onChange={(e) => {setPipeline({...pipeline, path_output: e.target.value})}}
      />
      
      <div className='submit-button'>
        {
          submitting ?
          <ThreeDots color="#3D405A" height={100} width={100} />
          :
          <MainStyle.Button 
            onClick={submit} 
          >
			Create Pipeline
		  </MainStyle.Button>
        }
      </div>
    </StyledCreatePipeline>
  )
}

export default CreatePipeline;