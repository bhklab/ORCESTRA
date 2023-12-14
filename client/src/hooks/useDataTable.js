import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { dataTypes } from '../components/Shared/Enums';
import styled from 'styled-components';

const StyledButton = styled.button`
    font-size: 11px;
    border: none;
    background: none;
    padding: 0px 0px;
    color: #007ad9;
    cursor: pointer;
`;

/**
 * A custom hook to be used for dataset tables.
 * Contains table cell templates and dataset download function for the download link.
 * @param {*} datasetType 
 * @returns 
 */
const useDataTable = (datasetType) => {

    const downloadDataset = (doi, link) => async (event) => {
        event.preventDefault();
        console.log('download dataset');
        await axios.post(`/api/data-object/download`, {datasetDOI: doi});
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', link);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const toolsRefTemplate = (rowData, column) => (
        <div>
            {rowData[column.field] ? rowData[column.field] : ''}
        </div>
    );

	const availableDataTemplate = (rowData, column) => {
		return(
            <div>
				CT
			</div>
        );
	}

    const dataTypeTemplate = (rowData, column) => {
        if(datasetType === dataTypes.pharmacogenomics){
            return(
                <div>
                    {
                        rowData[column.field] ? 
                        rowData[column.field].map(item => 
                            <div key={item.name}>
                                {item.name}{item.details ? ` [${item.details.microarrayType.label}]` : ''} ({item.genomeType})
                            </div>
                        ) 
                        : ''
                    }
                </div>
            );
        }

        const datatypeArray = rowData[column.field].filter(item => (item.name !== 'drugResponse' && item.name !== 'radiationSensitivity'));
        return(
            <div>{datatypeArray.map(item => <div key={item.name}>{item.name} ({item.genomeType})</div>)}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => (
        <Link to={`/${datasetType}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
    );

    const nameColumnTemplateUserDataset = (rowData, column) => (
        <Link to={`/${rowData.datasetType.name}/${rowData.doi}`}>{rowData.name}</Link>
    );

    const downloadTemplate = (rowData, column) => {
        if(rowData.downloadLink){
            if(Array.isArray(rowData.downloadLink)){
                return(
                    <a href={`http://doi.org/${rowData.doi}`} target="_blank" rel='noreferrer'>Multiple Data Objects</a>
                );
            }
            return(
                <StyledButton id={rowData._id} onClick={downloadDataset(rowData.doi, rowData.downloadLink)} >Download</StyledButton>
            );
        }
        return 'Not Available';
    };

    const filteredTemplate = (rowData, column) => (
        <div>{rowData.info.filteredSensitivity ? 'Yes' : 'No'}</div>
    );

    const canonicalTemplate = (rowData, column) => (
        <div>{rowData.info.canonical ? 'Yes' : ''}</div>
    );

    const sensitivityTemplate = (rowData, column) => {
        return(
            <div>{rowData.dataset.sensitivity ? rowData.dataset.sensitivity.version : 'Not Available'}</div>
        );
    }

    const privateTemplate = (rowData, column) => (
        <div>{rowData.info.private ? 'Yes' : 'No'}</div>
    );

    return {
        toolsRefTemplate,
        dataTypeTemplate,
        nameColumnTemplate,
        nameColumnTemplateUserDataset,
        downloadTemplate,
        filteredTemplate,
        canonicalTemplate,
        sensitivityTemplate,
        privateTemplate,
		availableDataTemplate
    };

}

export default useDataTable;