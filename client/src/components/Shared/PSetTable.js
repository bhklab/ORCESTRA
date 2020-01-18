import React, {useState, useEffect, useContext} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Link } from 'react-router-dom';
import * as API from '../Shared/APICalls';
import {AuthContext} from '../../context/auth';

const PSetTable = (props) => {

    const auth = useContext(AuthContext);
    
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

    const downloadOnePSet = (id, link) => (event) => {
        event.preventDefault();
        console.log('downloadOnePSet');
        API.downloadOnePSet(id);
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

    const downloadTemplate = (rowData, column) => {
        let link = 'Not Available';
        if(rowData.downloadLink){
            link = <a id={rowData._id} href='' onClick={downloadOnePSet(rowData._id, rowData.downloadLink)}>Download</a>
        }
        return(
            link
        )
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
            {auth.authenticated && <Column selectionMode="multiple" style={{width: '2.5em'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'10em'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'6.5em'}} sortable={true} />
            <Column className='textField' field='drugSensitivity.version' header='Drug Sensitivity' style={{width:'10.5em'}} sortable={true} />
            <Column field='rnaTool' body={toolsRefTemplate} style={{width:'8em'}} header='RNA Tool' sortable={true}  />
            <Column field='dnaTool' body={toolsRefTemplate} style={{width:'8em'}} header='DNA Tool' sortable={true} />
            <Column field='rnaRef' body={toolsRefTemplate} style={{width:'15em'}} header='RNA Ref' sortable={true} />
            <Column field='dnaRef' body={toolsRefTemplate} style={{width:'15em'}} header='DNA Ref' sortable={true} />
            <Column field='downloadLink' body={downloadTemplate} style={{width:'6.5em'}} header='Download' />
        </DataTable>
    );

}

export default PSetTable;