import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataTypes } from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';
import useWindowSize from '../../../hooks/useWindowSize';
import './DataTableStyle.css'; 

const RadioSetTable = (props) => {
    const [windowWidth] = useWindowSize();
    const isMobile = windowWidth < 600; // Adjust this value based on your needs

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DataTable 
            value={props.datasets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.datasets.length > 10} 
            rows={state.rows} 
            resizableColumns={true} 
            columnResizeMode="fit"
            scrollable={true} 
            scrollHeight={props.scrollHeight}
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' body={nameColumnTemplate} sortable={true} />

            {!isMobile && (
              <>
                <Column className='textField' field='dataset.name' header='Dataset' sortable={true} />
                <Column body={sensitivityTemplate} header='Radiation Sensitivity' />
                <Column field='availableDatatypes' body={dataTypeTemplate} header='Molecular Data' />
                <Column field='canonical' body={canonicalTemplate} header='Canonical' style={{ textAlign: 'center' }} />
                <Column field='info.numDownload' header='Number of Downloads' sortable={true} style={{ textAlign: 'center' }} />
              </>
            )}

            {props.download && <Column field='downloadLink' body={downloadTemplate} header='Download' style={{ textAlign: 'center' }} />}

            {isMobile && (
              <>
                {/* Define additional columns for mobile view here if needed */}
              </>
            )}
        </DataTable>
    );
}

export default RadioSetTable;
