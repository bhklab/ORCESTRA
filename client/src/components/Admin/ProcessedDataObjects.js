import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const StyledButton = styled.button`
    font-size: 11px;
    border: none;
    background: none;
    padding: 0px 0px;
    color: #007ad9;
    cursor: pointer;
`;

const ProcessedDataObjects = () => {
    const [processedObjects, setProcessedObjects] = useState([]);
    
    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('/api/view/admin/processed_data_obj');
            console.log(res.data)
            setProcessedObjects(res.data);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadDataset = (id, depositionId) => async (event) => {
        event.preventDefault();
        let body = { data_obj_id: id };
        if(depositionId){
            body.deposition_id = depositionId;
        }
        const res = await axios.post('/api/view/admin/upload_data_obj', body);
        console.log(res.data);
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
            <h4>Processed Data Objects</h4>
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
        </React.Fragment>
    );
}

export default ProcessedDataObjects;