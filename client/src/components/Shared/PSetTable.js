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

    const toolsRefTemplate = (rowData, column) => {
        let output ='';
        if(rowData[column.field]){
            output = rowData[column.field].map(item => <div key={item.name}>{item.name}</div>);
        }
        return(
            <div>{output}</div>
        );
    }

    const nameColumnTemplate = (rowData, column) => {
        let route = '/' + rowData.doi;
        return(
            <Link to={route} >{rowData.name}</Link>
        );
    }

    const updatePSetSelectionEvent = event => {
        props.updatePSetSelection(event.value);
    }

    return(
        <DataTable 
            value={props.allData} 
            selection={props.selectedPSets} onSelectionChange={updatePSetSelectionEvent} 
            paginator={true} rows={state.rows} 
        >
            <Column selectionMode="multiple" style={{width: '2.5em'}} />
            <Column className='textField' field='name' header='Name' style={{width:'10em'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'6.5em'}} sortable={true} />
            <Column className='textField' field='drugSensitivity.version' header='Drug Sensitivity' style={{width:'10.5em'}} sortable={true} />
            <Column field='rnaTool' body={toolsRefTemplate} style={{width:'8em'}} header='RNA Tool' sortable={true}  />
            <Column field='dnaTool' body={toolsRefTemplate} style={{width:'8em'}} header='DNA Tool' sortable={true} />
            <Column field='rnaRef' body={toolsRefTemplate} style={{width:'15em'}} header='RNA Ref' sortable={true} />
            <Column field='dnaRef' body={toolsRefTemplate} style={{width:'15em'}} header='DNA Ref' sortable={true} />
        </DataTable>
    );

}

export default PSetTable;