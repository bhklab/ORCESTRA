import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import {dataTypes} from '../../Shared/Enums';

const PSetTable = (props) => {

    const { 
        psets, 
        selectedPSets, 
        updatePSetSelection, 
        scrollHeight, 
        download, 
        authenticated, 
    } = props;
    
    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    });

    useEffect(()=>{
        setState({...state, loading: false})
    }, []);

    const downloadPSet = (doi, link) => async (event) => {
        event.preventDefault();
        console.log('downloadOnePSet');
        await fetch(`/api/${dataTypes.pharmacogenomics}/download`, {
            method: 'POST',
            body: JSON.stringify({datasetDOI: doi}),
            headers: {'Content-type': 'application/json'}
        })
        const anchor = document.createElement('a');
        anchor.setAttribute('download', null);
        anchor.style.display = 'none';
        anchor.setAttribute('href', link);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const toolsRefTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? rowData[column.field].map(item => <div key={item.name}>{item.label}</div>) : ''}</div>
    );

    const dataTypeTemplate = (rowData, column) => (
        <div>
            {
                rowData[column.field] ? 
                rowData[column.field].map(item => <div key={item.name}>{item.name}{item.microarrayType ? ` [${item.microarrayType.label}]` : ''} ({item.type})</div>) 
                : ''
            }
        </div>
    );

    const nameColumnTemplate = (rowData, column) => (
        rowData.doi.length > 0 ? 
        <Link to={`/${dataTypes.pharmacogenomics}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
        :
        rowData.name
    );

    const downloadTemplate = (rowData, column) => {
        return(rowData.downloadLink ? <a id={rowData._id} href='#' onClick={downloadPSet(rowData.doi, rowData.downloadLink)}>Download</a> : 'Not Available');
    };

    const filteredTemplate = (rowData, column) => (
        <div>{rowData.dataset.filteredSensitivity ? 'Yes' : 'No'}</div>
    );

    const canonicalTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );


    return(
        <DataTable 
            value={psets} 
            selection={selectedPSets} 
            onSelectionChange={updatePSetSelection} 
            paginator={true} 
            rows={state.rows} 
            resizableColumns={true} 
            columnResizeMode="fit"
            scrollable={true} 
            scrollHeight={scrollHeight}
        >
            {
                authenticated && 
                <Column selectionMode="multiple" style={{width: '40px', textAlign: 'center'}} />
            }
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
            <Column className='textField' field='dataset.versionInfo' header='Drug Sensitivity' style={{width:'120px'}} sortable={true} />
            <Column field='dataset.filteredSensitivity' body={filteredTemplate} style={{width:'90px', textAlign: 'center'}} header='Filtered Drug Sensitivity' />
            <Column field='rnaTool' body={toolsRefTemplate} style={{width:'120px'}} header='RNA Tool' sortable={true}  />
            <Column field='rnaRef' body={toolsRefTemplate} style={{width:'120px'}} header='RNA Ref' sortable={true} />
            <Column field='dataType' body={dataTypeTemplate} style={{width:'125px'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'90px', textAlign: 'center'}} header='Canonical' />
            {
                download && 
                <Column field='downloadLink' body={downloadTemplate} style={{width:'90px', textAlign: 'center'}} header='Download' /> 
            }
        </DataTable>
    );

}

export default PSetTable;