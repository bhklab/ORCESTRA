import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataTypes } from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';

const RadioSetTable = (props) => {

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
    } = useDataTable(dataTypes.radiogenomics);

    useEffect(() => {
        setState({...state, loading: false});
    }, []);

    return (
        <DataTable 
            value={props.datasets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.datasets.length > 10} 
            rows={state.rows} 
            resizableColumns={true} 
            scrollHeight={props.scrollHeight}
            showGridlines
            size='small'
        >
            <Column field='name' header='Name' body={nameColumnTemplate} sortable={true} style={{ textAlign: 'center' }}/>
            <Column field='dataset.name' header='Dataset' sortable={true} style={{ textAlign: 'center' }}/>
            <Column header='Radiation Sensitivity' body={sensitivityTemplate} style={{ textAlign: 'center' }}/>
            <Column field='availableDatatypes' header='Molecular Data' body={dataTypeTemplate} style={{ textAlign: 'center' }}/>
            <Column field='canonical' header='Canonical' body={canonicalTemplate} style={{ textAlign: 'center' }} />
            <Column field='info.numDownload' header='Number of Downloads' sortable={true} style={{ textAlign: 'center' }} />
            {props.download && <Column field='downloadLink' header='Download' body={downloadTemplate} style={{ textAlign: 'center' }} />}
        </DataTable>
    );
}

export default RadioSetTable;
