import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {dataTypes} from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';

const ToxicoSetTable = (props) => {
    
    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    });

    const {
        nameColumnTemplate,
        downloadTemplate,
        canonicalTemplate,
        sensitivityTemplate,
        dataTypeTemplate,
    } = useDataTable(dataTypes.toxicogenomics);

    useEffect(()=>{
        setState({...state, loading: false});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div className="table-container">  
        <DataTable 
            value={props.tsets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.tsets.length > 10} 
            rows={state.rows} 
            resizableColumns={true} 
            columnResizeMode="fit"
            scrollable={true} 
            showGridlines
            size='small'
            scrollHeight={props.scrollHeight }
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'120px'}} sortable={true} />
            <Column body={sensitivityTemplate} style={{width:'100px'}} header='Drug Response' />
            <Column field='availableDatatypes' body={dataTypeTemplate} style={{width:'100px'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'80px', textAlign: 'center'}} header='Canonical' />
            <Column field='info.numDownload' style={{width:'100px', textAlign: 'center'}} header='Number of Downloads' sortable={true} />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'60px', textAlign: 'center'}} header='Download' /> }
        </DataTable>
        </div>
    );

}

export default ToxicoSetTable;