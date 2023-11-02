import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import CustomSelect from '../Shared/CustomSelect';
import CustomCheckbox from '../Shared/CustomCheckbox';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';

const StyledRunPipeline = styled.div`
  max-width: 800px;
  .content {
    display: flex;
    margin-top: 30px;
    margin-bottom: 20px;
    .left {
      width: 400px;
      margin-right: 30px;
    }
    .right {
      width: 400px;
      background-color: #ffffff;
      border-radius: 5px;
      padding: 0 15px 0 15px;
    }
    .sub-header {
      display: flex;
      align-items: center;
      h4 {
        margin-right: 20px;
      }
    }
    .field {
      display: flex;
      align-items: center;
      width: 200px;
      margin-bottom: 10px;
      .delete-btn {
        margin-right: 10px;
      }
      .textfield {
        margin-right: 10px;
      }
    }
    .paramfield {
      margin-bottom: 10px;
    }
  }
`;

const submissionSuccessMessage = {
  severity: 'success', 
  summary: 'Pipeline Submitted', 
  detail: '', 
  sticky: true 
}

const submissionErrorMessage = {
  severity: 'error', 
  summary: 'Pipeline Not Submissted', 
  detail: '', 
  sticky: true 
}

const RunPiepline = () => {

  const [pipelines, setPipelines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({});

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('/api/view/admin/pipelines');
      console.log(res.data);
      setPipelines(res.data);
    }
    getData();
  }, []);

  const onSelect = (e) => {
    setSelected(e.value);
    const found = pipelines.find(pipeline => pipeline.name === e.value.label);
    let runConfig = {
      pipeline: found.name,
      run_all: false,
      preserved_data: []
    }
    if(found.additional_parameters){
      runConfig.additional_parameters = found.additional_parameters
    }
    setSelectedPipeline(runConfig);
  }

  const addDirectory = (e) => {
    let directories = [...selectedPipeline.preserved_data];
    directories.push('');
    setSelectedPipeline({
      ...selectedPipeline,
      preserved_data: directories
    });
  }

  const updateDirectory = (index) => (e) => {
    let directories = [...selectedPipeline.preserved_data];
    directories[index] = e.target.value;
    setSelectedPipeline({
      ...selectedPipeline,
      preserved_data: directories
    });
  }

  const removeDirectory = (index) => (e) => {
    let directories = [...selectedPipeline.preserved_data];
    directories.splice(index, 1);
    setSelectedPipeline({
      ...selectedPipeline,
      preserved_data: directories
    });    
  }

  const updateParameter = (key) => (e) => {
    let additionalParams = {...selectedPipeline.additional_parameters};
    additionalParams[key] = e.target.value;
    setSelectedPipeline({
      ...selectedPipeline,
      additional_parameters: additionalParams
    }); 
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await axios.post('/api/admin/data-processing/run-pipeline', selectedPipeline);
      console.log(res.data);
      if(res.data.status === 'submitted'){
        setSubmitMessage({...submissionSuccessMessage, detail: res.data.message});
      }else{
        setSubmitMessage({...submissionErrorMessage, detail: res.data.message});
      }
    }catch(error){
      setSubmitMessage({...submissionErrorMessage, detail: 'An error occurred'});
    }finally{
      setLoading(false);
      setShowMsg(Math.random());
    }
  }

  return(
    <StyledRunPipeline>
      <CustomMessages trigger={showMsg} message={submitMessage} />
      <h3>Run a Pipeline</h3>
      {
        pipelines.length > 0 &&
        <div>
          <CustomSelect 
            selectOne
            selected={selected}
            options={pipelines.map(pipeline => ({label: pipeline.name, value: pipeline.name}))}
            onChange={onSelect}
            label='Select a pipeline: '
          />
          {
            selectedPipeline &&
            <React.Fragment>
              <div className='content'>
                <div className='left'>
                  <h3>Set run configuration</h3>
                  <CustomCheckbox 
                    label='Run all:' 
                    checked={selectedPipeline.run_all} 
                    onChange={(e) => setSelectedPipeline({...selectedPipeline, run_all: e.checked})}
                  />
                  <div className='sub-header'>
                    <h4>Preserved Directories</h4>
                    {
                      selectedPipeline.preserved_data.length === 0 &&
                      <Button icon='pi pi-plus' onClick={addDirectory} />
                    }
                  </div>
                  <div>
                    {
                      selectedPipeline.preserved_data.map((item, i) => (
                        <div className='field' key={i}>
                          <CustomInputText 
                            className='textfield'
                            value={item} 
                            onChange={updateDirectory(i)}
                          />
                          <Button 
                            className='p-button-danger delete-btn'
                            icon='pi pi-times' 
                            onClick={removeDirectory(i)} 
                          />
                          {
                            i === selectedPipeline.preserved_data.length - 1 &&
                            <Button 
                              icon='pi pi-plus' 
                              onClick={addDirectory} 
                            />
                          }
                        </div>
                      ))
                    }
                  </div>
                  {
                    selectedPipeline.additional_parameters &&
                    <div>
                      <h4>Additional Parameters</h4>
                      <div>
                      {
                        Object.keys(selectedPipeline.additional_parameters).map((key, i) => (
                          <CustomInputText 
                            key={i}
                            className='paramfield'
                            label={key}
                            value={selectedPipeline.additional_parameters[key]} 
                            onChange={updateParameter(key)}
                          />
                        ))
                      }
                      </div>
                    </div>
                  }
                </div>
                <div className='right'>
                  <h3>Run Configuration</h3>
                  <pre>
                    {
                      JSON.stringify(selectedPipeline, null, 2)
                    }
                  </pre>
                </div>
              </div>
              {
                loading ?
                <ThreeDots color="#3D405A" height={100} width={100} />
                :
                <Button 
                  className='p-button-primary'
                  label='Run Pipeline' 
                  onClick={submit} 
                />
              }
            </React.Fragment>
          }
        </div>
      }
    </StyledRunPipeline>
  );
}

export default RunPiepline;