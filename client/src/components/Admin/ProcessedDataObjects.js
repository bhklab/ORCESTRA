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
            const res = await axios.get('/api/view/admin/processed_data_obj', {params: {status: 'uploaded'}});
            console.log(res.data)
            setProcessedObjects(res.data);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloadDataset = (link) => async (event) => {
        event.preventDefault();
        console.log('download dataset');
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', link);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const pipelineTemplate = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`${rowData.git_url.replace('.git', `/tree/${rowData.commit_id}`)}`} target="_blank">{rowData.pipeline_name}</Link>
        :
        rowData.name
    );

    const doiTemplate = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`http://doi.org/${rowData.doi}`} target="_blank">{rowData.doi}</Link>
        :
        rowData.name
    );

    const downloadTemplate = (rowData, column) => {
        if(rowData.download_link){
            return(
                <StyledButton id={rowData._id} onClick={downloadDataset(rowData.downloadLink)} >Download</StyledButton>
            );
        }
    };

    return(
        <React.Fragment>
            <h4>Processed Data Objects</h4>
            <DataTable 
                value={processedObjects} 
                paginator={true} 
                rows={25} 
                resizableColumns={true} 
                columnResizeMode="fit"
                scrollable={true} 
                scrollHeight={"600px"}
            >
                <Column className='textField' field='pipeline_name' header='Pipeline' style={{width:'100px'}} body={pipelineTemplate} sortable={true} />
                <Column className='textField' field='filename' header='filename' style={{width:'100px'}} sortable={true} />
                <Column className='textField' field='doi' header='DOI'  body={doiTemplate} />
                <Column field='process_start_date' header='Start' />
                <Column field='process_end_date' header='End' />
                <Column field='downloadLink' body={downloadTemplate} style={{width:'90px', textAlign: 'center'}} header='Download' /> 
                <Column field='' header='Assigned Data Object' />
            </DataTable>
        </React.Fragment>
    );
}

export default ProcessedDataObjects;