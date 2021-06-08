import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useDataTable from '../../hooks/useDataTable';

const StyledUserDataset = styled.div`
    width: 100%;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 1px 20px 20px 20px;
    background-color: rgba(255, 255, 255, 0.8);
    .userPSetContent{
        margin-top: 20px;
        width: 100%;
    }
    .footer{
        margin-top: 20px;
    }
`;

const StyledButton = styled.button`
    font-size: 11px;
    border: none;
    background: none;
    padding: 0px 0px;
    color: #007ad9;
    cursor: pointer;
`;

const DataSubmissionList = (props) => {
    const { className, heading, datasets, admin, markComplete } = props;

    const {
        privateTemplate
    } = useDataTable(null);

    const nameColumnTemplateDataSubmission = (rowData, column) => (
        <Link to={`/app/data_submission/submitted/${rowData._id}`} target="_blank">{rowData.info.name}</Link>
    );

    const completeButtonTemplate = (rowData, column) => {
        return(
            rowData.info.status !== 'complete' ? 
            <StyledButton id={rowData._id} onClick={(e) => {markComplete(e, rowData._id)}} >Complete</StyledButton>
            : 
            ''
        );
    };

    return(
        <StyledUserDataset className={className}>
            <h3>{heading}</h3>
            {
                datasets.length > 0 ?
                <div>
                    <DataTable 
                        value={datasets} 
                        paginator={true} 
                        rows={10} 
                        resizableColumns={true} 
                        scrollable={true} 
                        scrollHeight={'300px'}
                    >
                        <Column className='textField' field='info.name' header='Name' style={{width:'150px'}} body={nameColumnTemplateDataSubmission} sortable={true} />
                        <Column className='textField' field='info.datasetType.label' header='Dataset Type' style={{width:'100px'}} sortable={true} />
                        <Column className='textField' field='info.status' header='Status' style={{width:'100px'}} sortable={true} />
                        <Column field='info.private' body={privateTemplate} style={{width:'60px', textAlign: 'center'}} header='Private' />
                        {
                            admin &&
                            <Column body={completeButtonTemplate} style={{width:'90px', textAlign: 'center'}} header='Mark as complete' />
                        } 
                    </DataTable>
                </div>
                :
                <p>None</p>
            }
            
        </StyledUserDataset>
    );
    
}

export default DataSubmissionList;