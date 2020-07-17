import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';

const PSetTable = (props) => {
    
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

    const downloadPSet = (id, link) => async (event) => {
        event.preventDefault();
        console.log('downloadOnePSet');
        await fetch('/api/pset/download', {
            method: 'POST',
            body: JSON.stringify({psetID: id}),
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

    const toolsRefTemplate = (rowData, column) => {
        let output ='';
        if(rowData[column.field]){
            output = rowData[column.field].map(item => <div key={item.name}>{item.label}</div>);
        }
        return(
            <div>{output}</div>
        );
    }

    const dataTypeTemplate = (rowData, column) => {
        let output ='';
        if(rowData[column.field]){
            output = rowData[column.field].map(item => <div key={item.name}>{item.name} ({item.type})</div>);
        }
        return(
            <div>{output}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => {
        let route = '/' + rowData.doi;
        return(
            <Link to={route} target="_blank">{rowData.name}</Link>
        );
    }

    const downloadTemplate = (rowData, column) => {
        let link = 'Not Available';
        if(rowData.downloadLink){
            link = <a id={rowData._id} href='#' onClick={downloadPSet(rowData._id, rowData.downloadLink)}>Download</a>
        }
        return(
            link
        )
    }

    const canonicalTemplate = (rowData, column) => {
        let output = ''
        if(rowData[column.field]){
            output = 'Yes'
        }
        return(
            <div>{output}</div>
        );
    }

    const updatePSetSelectionEvent = event => {
        props.updatePSetSelection(event.value);
    }

    return(
        <DataTable 
            value={props.psets} 
            selection={props.selectedPSets} onSelectionChange={updatePSetSelectionEvent} 
            paginator={true} rows={state.rows} 
            scrollable={true} resizableColumns={true} columnResizeMode="fit" style={{maxWidth: '900px'}}
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '2em', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'6em'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'4em'}} sortable={true} />
            <Column className='textField' field='dataset.versionInfo' header='Drug Sensitivity' style={{width:'6em'}} sortable={true} />
            <Column field='rnaTool' body={toolsRefTemplate} style={{width:'5em'}} header='RNA Tool' sortable={true}  />
            <Column field='rnaRef' body={toolsRefTemplate} style={{width:'5em'}} header='RNA Ref' sortable={true} />
            <Column field='dataType' body={dataTypeTemplate} style={{width:'5em'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'3.5em', textAlign: 'center'}} header='Canonical' />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'3.5em', textAlign: 'center'}} header='Download' /> }
        </DataTable>
    );

}

export default PSetTable;