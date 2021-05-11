import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import {dataTypes} from '../../Shared/Enums';

const XevaSetTable = (props) => {
    
    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    })

    useEffect(()=>{
        setState({...state, loading: false})
    }, []);

    const downloadPSet = (doi, link) => async (event) => {
        event.preventDefault();
        console.log('downloadOneXevaSet');
        await fetch(`/api/${dataTypes.xenographic}/download`, {
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

    const drugSensitivityTemplate = (rowData, column) => {
        const drugSensitivity = rowData[column.field].find(item => (item.name === 'drugResponse'));
        return(
            <div>{drugSensitivity ? drugSensitivity.version : 'Not Available'}</div>
        );
    }

    const dataTypeTemplate = (rowData, column) => {
        const dataTypes = rowData[column.field].filter(item => (item.name !== 'drugResponse'));
        return(
        <div>{dataTypes.map(item => <div key={item.name}>{item.name} ({item.type})</div>)}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => (
        <Link to={`/${dataTypes.xenographic}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
    );

    const downloadTemplate = (rowData, column) => {
        return(rowData.downloadLink ? <a id={rowData._id} href='#' onClick={downloadPSet(rowData.doi, rowData.downloadLink)}>Download</a> : 'Not Available');
    };

    const canonicalTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );

    return(
        <DataTable 
            value={props.xevasets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.xevasets.length > 10} rows={state.rows} 
            resizableColumns={true} columnResizeMode="fit"
            scrollable={true} scrollHeight={props.scrollHeight }
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
            <Column field='dataType' body={drugSensitivityTemplate} style={{width:'100px'}} header='Drug Response' />
            <Column field='dataType' body={dataTypeTemplate} style={{width:'100px'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'90px', textAlign: 'center'}} header='Canonical' />
            <Column field='download' style={{width:'100px', textAlign: 'center'}} header='Number of Downloads' sortable={true} />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'60px', textAlign: 'center'}} header='Download' /> }
        </DataTable>
    );

}

export default XevaSetTable;