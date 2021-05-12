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
        await axios.post(`/api/${datasetType}/download`, {datasetDOI: doi});
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
            {rowData[column.field] ? rowData[column.field].map(item => <div key={item.name}>{item.label}</div>) : ''}
        </div>
    );

    const dataTypeTemplate = (rowData, column) => {
        if(datasetType === dataTypes.pharmacogenomics){
            return(
                <div>
                    {
                        rowData[column.field] ? 
                        rowData[column.field].map(item => 
                            <div key={item.name}>
                                {item.name}{item.microarrayType ? ` [${item.microarrayType.label}]` : ''} ({item.type})
                            </div>
                        ) 
                        : ''
                    }
                </div>
            );
        }

        if(datasetType === dataTypes.radiogenomics){
            const dataTypes = rowData[column.field].filter(item => (item.name !== 'radiationSensitivity'));
            return(
                <div>{dataTypes.map(item => <div key={item.name}>{item.name} ({item.type})</div>)}</div>
            );
        }

        const datatypeArray = rowData[column.field].filter(item => (item.name !== 'drugResponse'));
        return(
            <div>{datatypeArray.map(item => <div key={item.name}>{item.name} ({item.type})</div>)}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`/${datasetType}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
        :
        rowData.name
    );

    const nameColumnTemplateUserDataset = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`/${rowData.datasetType.name}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
        :
        rowData.name
    );

    const downloadTemplate = (rowData, column) => {
        return(
            rowData.downloadLink ? 
            <StyledButton id={rowData._id} onClick={downloadDataset(rowData.doi, rowData.downloadLink)} >Download</StyledButton>
            : 
            'Not Available'
        );
    };

    const filteredTemplate = (rowData, column) => (
        <div>{rowData.dataset.filteredSensitivity ? 'Yes' : 'No'}</div>
    );

    const canonicalTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );

    const drugSensitivityTemplate = (rowData, column) => {
        const drugSensitivity = rowData[column.field].find(item => (item.name === 'drugResponse'));
        return(
            <div>{drugSensitivity ? drugSensitivity.version : 'Not Available'}</div>
        );
    }

    const radiationSensitivityTemplate = (rowData, column) => {
        const radiationSensitivity = rowData[column.field].find(item => (item.name === 'radiationSensitivity'));
        return(
            <div>{radiationSensitivity ? radiationSensitivity.version : 'Not Available'}</div>
        );
    }

    const privateTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : 'No'}</div>
    );

    return {
        toolsRefTemplate,
        dataTypeTemplate,
        nameColumnTemplate,
        nameColumnTemplateUserDataset,
        downloadTemplate,
        filteredTemplate,
        canonicalTemplate,
        drugSensitivityTemplate,
        radiationSensitivityTemplate,
        privateTemplate
    };

}

export default useDataTable;