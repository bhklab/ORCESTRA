import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomInputText from '../Shared/CustomInputText';
import CustomMessages from '../Shared/CustomMessages';
import CustomSelect from '../Shared/CustomSelect';
import CustomCheckbox from '../Shared/CustomCheckbox';
import { Button } from 'primereact/button';
import StyledDataDisplayRun from './SubComponents/DataDisplayRun';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import * as Mainstyle from '../Main/MainStyle'

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

const creationSuccessMessage = {
  severity: 'success', 
  summary: 'Pipeline Run Complete!', 
  detail: '', 
  sticky: true 
}

const creationErrorMessage = {
  severity: 'error', 
  summary: 'Error Running Pipeline', 
  detail: '', 
  sticky: true 
}

const RunPipeline = () => {
  
  const initialState = {
    pipeline_name: '',
    force_run: '',
    release_notes: '',
};

  const [pipeline, setPipeline] = useState(initialState);
  const [pipelines, setPipelines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({});
  const [selectedForceRun, setSelectedForceRun] = useState(null);
  const [releaseNotes, setReleaseNotes] = useState(null);
  const [resData, setResData] = useState(null);

  useEffect(() => {
    const getPipelines = async () => {
      try {
        const response = await axios.get('/api/view/admin/pipelines');
        console.log(response.data);
        setPipelines(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    getPipelines();
  }, []);

  const handleInputChange = (e, field) => {
    setPipeline({
      ...pipeline,
      [field]: e.target.value
    });
  };

  const resetForm = () => {
    setPipeline(initialState);
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    console.log(pipeline);
    try {
        const res = await axios.post('/api/admin/data-processing/run-pipeline', { pipeline });
        console.log(res.data);
        if (res.data.success === "yes") {
          setSubmitMessage({...creationSuccessMessage});
          setResData(res.data);
          resetForm();
        } else {
            setSubmitMessage({...creationErrorMessage, detail: res.data.detail});
        }
        setShowMsg(true);
    } catch (error) {
        console.log(error.response);
        if (error.response && error.response.data && error.response.data.detail) {
            setSubmitMessage({...creationErrorMessage, detail: error.response.data.detail});
        } else {
            setSubmitMessage({...creationErrorMessage, detail: "An error occurred"});
        }
        setShowMsg(true);
    } finally {
        setLoading(false);
        setShowMsg(Math.random());
    }
};

  return(
    <StyledRunPipeline>
      <CustomMessages trigger={showMsg} message={submitMessage} />
      <h3>Run Pipeline</h3>
      {
        // pipelines.length > 0 &&  
        <div>
          <CustomSelect 
          selectOne
          selected={selectedPipeline}
          options={(pipelines || []).filter(pipeline => pipeline !== null).map(pipeline => ({label: pipeline, value: pipeline}))}
          label='Select pipeline: '
          value={pipeline.pipeline_name}
          onChange={(e) => {
            setSelectedPipeline(e.value);
            handleInputChange(e, 'pipeline_name');
          }}
          />
          <CustomSelect 
            selectOne
            selected={selectedForceRun}
            options={[
              { label: 'True', value: 'true' },
              { label: 'False', value: 'false' }
            ]}
            label='Force run:'
            value={pipeline.force_run}
            onChange={(e) => {
              setSelectedForceRun(e.value);
              handleInputChange(e, 'force_run');
            }}
          />
          <CustomInputText
            selected={releaseNotes} 
            label='Release Notes:'
            value={pipeline.release_notes}
            onChange={(e) => {
              setReleaseNotes(e.target.value);
              handleInputChange(e, 'release_notes');
            }}
          />
          {
            // selectedPipeline &&
            <React.Fragment>
              <div className='content'>
                
                  <CustomCheckbox 
                    label='Run all:' 
                  />
                </div>
              
              {
              loading ? (
              <ThreeDots color="#3D405A" height={100} width={100} />
              ) : (
                  <Button
                      onClick={submit}
                      disabled={
                          pipeline.pipeline_name === '' ||
                          pipeline.force_run === '' ||
                          pipeline.release_notes === ''
                      }
                  >
                      Run Pipeline
                  </Button>
              )
              }
            </React.Fragment>
          }
        </div>
      }
      {resData && <StyledDataDisplayRun data={resData} />}
    </StyledRunPipeline>
  );
}

export default RunPipeline;
