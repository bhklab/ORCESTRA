import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {dataTypes} from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';

const RadiomicSetTable = (props) => {
    
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
		availableDataTemplate
    } = useDataTable(dataTypes.radiomics);

    useEffect(()=>{
        setState({...state, loading: false});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <DataTable 
            value={props.datasets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.datasets.length > 10} rows={state.rows} 
            resizableColumns={true} columnResizeMode="fit"
            scrollable={true} scrollHeight={props.scrollHeight }
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'75px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'75px'}} sortable={true} />
            <Column field="availableDatatypes" body={availableDataTemplate} style={{width:'75px'}} header='Image Modality' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'75px', textAlign: 'center'}} header='Canonical' />
            <Column field='info.numDownload' style={{width:'25px', textAlign: 'center'}} header='Number of Downloads' sortable={true} />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'60px', textAlign: 'center'}} header='Download' /> }
        </DataTable>
    );

}

export default RadiomicSetTable;