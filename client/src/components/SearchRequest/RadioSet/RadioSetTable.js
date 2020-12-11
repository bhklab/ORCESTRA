import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import {dataTypes} from '../../Shared/Enums';

const RadioSetTable = (props) => {
    
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
        console.log('downloadOnePSet');
        await fetch(`/api/${dataTypes.radiogenomics}/download`, {
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

    const radiationSensitivityTemplate = (rowData, column) => {
        const radiationSensitivity = rowData[column.field].find(item => (item.name === 'radiationSensitivity'));
        return(
            <div>{radiationSensitivity ? radiationSensitivity.version : 'Not Available'}</div>
        );
    }

    const dataTypeTemplate = (rowData, column) => {
        const dataTypes = rowData[column.field].filter(item => (item.name !== 'radiationSensitivity'));
        return(
            <div>{dataTypes.map(item => <div key={item.name}>{item.label}</div>)}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => (
        <Link to={`/${dataTypes.radiogenomics}/${rowData.doi}`} target="_blank">{rowData.name}</Link>
    );

    const downloadTemplate = (rowData, column) => {
        return(rowData.downloadLink ? <a id={rowData._id} href='#' onClick={downloadPSet(rowData.doi, rowData.downloadLink)}>Download</a> : 'Not Available');
    };

    const canonicalTemplate = (rowData, column) => (
        <div>{rowData[column.field] ? 'Yes' : ''}</div>
    );

    return(
        <DataTable 
            value={props.tsets} 
            selection={props.selectedTSets} onSelectionChange={event => {props.updatePSetSelection(event.value)}} 
            paginator={props.tsets.length > 10} rows={state.rows} 
            resizableColumns={true} columnResizeMode="fit"
            scrollable={true} scrollHeight={props.scrollHeight }
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
            <Column field='dataType' body={radiationSensitivityTemplate} style={{width:'100px'}} header='Radation Sensitivity' />
            <Column field='dataType' body={dataTypeTemplate} style={{width:'100px'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'90px', textAlign: 'center'}} header='Canonical' />
            <Column field='download' style={{width:'100px', textAlign: 'center'}} header='Number of Downloads' sortable={true} />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'60px', textAlign: 'center'}} header='Download' /> }
        </DataTable>
    );

}

export default RadioSetTable;