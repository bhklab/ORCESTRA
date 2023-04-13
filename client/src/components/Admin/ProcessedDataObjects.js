import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import CustomMessages from '../Shared/CustomMessages';
import { Column } from 'primereact/column';
import Loader from 'react-loader-spinner';

const StyledButton = styled.button`
    font-size: 11px;
    border: none;
    background: none;
    padding: 0px 0px;
    color: #007ad9;
    cursor: pointer;
`;
const StyledLoading = styled.div`
    position: absolute;    
    width: 100%; 
    height: 100%; 
    background-color: #ffffff; 
    opacity: 0.6; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 999;
`;

const requestSuccessMessage = {
    severity: 'success', 
    summary: 'Upload started', 
    detail: '', 
    sticky: true 
  }
  
  const requestErrorMessage = {
    severity: 'error', 
    summary: 'An error occurred', 
    detail: '', 
    sticky: true 
  }

const ProcessedDataObjects = () => {
    const [processedObjects, setProcessedObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMsg, setShowMsg] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({});
    
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/view/admin/processed_data_obj');
            console.log(res.data)
            setProcessedObjects(res.data);
            setLoading(false);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadDataset = (id, depositionId) => async (event) => {
        event.preventDefault();
        setLoading(true);
        let body = { data_obj_id: id };
        if(depositionId){
            body.deposition_id = depositionId;
        }
        try{
            const res = await axios.post('/api/admin/data-processing/upload_data_obj', body);
            console.log(res.data);
            if(res.data.status === 'ok'){
                setSubmitMessage({...requestSuccessMessage, detail: res.data.message});
              }else{
                setSubmitMessage({...requestErrorMessage, detail: res.data.message});
            }
        }catch(error){
            console.log(error);
            setSubmitMessage({...requestErrorMessage, detail: 'An error occurred'});
        }finally{
            setShowMsg(Math.random());
            setLoading(false);
        }
    }

    const pipelineTemplate = (rowData, column) => (
        <Link to={`${rowData.pipeline.git_url.replace('.git', `/tree/${rowData.commit_id}`)}`} target="_blank">{rowData.pipeline.name}</Link>
    );

    const doiTemplate = (rowData, column) => (
        rowData.doi ? 
        <Link to={`http://doi.org/${rowData.doi}`} target="_blank">{rowData.doi}</Link>
        :
        ''
    );

    const filenameTemplate = (rowData, column) => {
        if(rowData.object_files){
            return(
                <div>
                    {
                        rowData.object_files.map((item, i) => (
                            <div key={i}>{item.filename}</div>
                        ))
                    }
                </div>
            )
        }else{
            return(
                rowData.pipeline.object_name
            )
        }
    }

    const startDateTimeTemplate = (rowData, column) => (
        rowData.process_start_date ? rowData.process_start_date.split('.')[0] : ''
    )

    const endDateTimeTemplate = (rowData, column) => (
        rowData.process_end_date ? rowData.process_end_date.split('.')[0] : ''
    )

    const assignedObjTemplate = (rowData, column) => (
        rowData.assigned ?
        <Link to={`/${rowData.assigned.datasetType}/${rowData.doi}`} target="_blank">{rowData.assigned.name}</Link>
        :
        ''
    )

    const actionTemplate = (rowData, column) => {
        let component = ''
        switch(rowData.status){
            case 'processing':
                break;
            case 'complete':
                component = <StyledButton onClick={uploadDataset(String(rowData._id))}>Upload</StyledButton>
                break;
            case 'uploaded':
                component = rowData.assigned ? <StyledButton>Un-assign</StyledButton> : <StyledButton>Assign</StyledButton>
                break;
            case 'uploading':
                component = 'Uploading';
                break;
            default:
                break;
        }
        return(component)
    }

    return(
        <React.Fragment>
            <CustomMessages trigger={showMsg} message={submitMessage} />
            <h4>Processed Data Objects</h4>
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
            {
                loading && 
                <StyledLoading>
                    <Loader type="ThreeDots" color="#3D405A" height={100} width={100} />
                </StyledLoading>
            }
            {
                processedObjects.length > 0 &&
                <DataTable 
                    value={processedObjects} 
                    paginator={true} 
                    rows={30} 
                    resizableColumns={true} 
                    columnResizeMode="fit"
                    scrollable={true} 
                    scrollHeight={"1000px"}
                >
                    <Column className='textField' header='Pipeline' style={{width:'200px'}} body={pipelineTemplate} />
                    <Column className='textField' field='status' header='Status' style={{width:'100px'}} />
                    <Column className='textField' header='Filename' style={{width:'200px'}} body={filenameTemplate}/>
                    <Column className='textField' header='DOI' style={{width:'200px'}} body={doiTemplate} />
                    <Column field='process_start_date' header='Start' style={{width:'150px'}} body={startDateTimeTemplate} />
                    <Column field='process_end_date' header='End' style={{width:'150px'}} body={endDateTimeTemplate} />
                    <Column header='Assigned Data Object' style={{width: '300px'}} body={assignedObjTemplate} />
                    <Column header='Action' body={actionTemplate} style={{width:'100px'}} />
                </DataTable>
            } 
            </div>      
        </React.Fragment>
    );
}

export default ProcessedDataObjects;