import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import useDataTable from '../../../hooks/useDataTable';

const ClinGenSetTable = (props) => {
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
        dataTypeTemplate,
    } = useDataTable(props.datasetType);

    useEffect(()=>{
        setState({...state, loading: false});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const recistTemplate = (rowData, column) => {
        return(
            <div>{rowData.dataset.survival.recistCriteria ? 'Available' : 'Not Available'}</div>
        );
    };

    const clinEndpointTemplate = (rowData, column) => {
        return(
            <div>{rowData.dataset.survival.clinicalEndpoints ? rowData.dataset.survival.clinicalEndpoints : 'Not Available'}</div>
        );
    }

    return(
        <div className="table-container">
        <DataTable 
            value={props.datasets} 
            selection={props.selectedDatasets} 
            onSelectionChange={props.updateDatasetSelection} 
            paginator={props.datasets.length > 10} 
            rows={state.rows} 
            resizableColumns={true} 
            columnResizeMode="fit"
            scrollable={true} 
            scrollHeight={props.scrollHeight }
            showGridlines
            size='small'
        >
            {props.authenticated && <Column selectionMode="multiple" style={{width: '30px', textAlign: 'center'}} />}
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
            <Column body={recistTemplate} style={{width:'90px'}} header='RECIST Criteria' />
            <Column body={clinEndpointTemplate} style={{width:'90px'}} header='Clinical Endpoints' />
            <Column field='availableDatatypes' body={dataTypeTemplate} style={{width:'100px'}} header='Molecular Data' />
            {
                props.datasetType === 'clinical_icb' ?
                <Column field='info.other.rna_ref' header='RNA Ref' style={{width:'80px'}} />
                :
                undefined
            }
            <Column field='canonical' body={canonicalTemplate} style={{width:'70px', textAlign: 'center'}} header='Canonical' />
            <Column field='info.numDownload' style={{width:'50px', textAlign: 'center'}} header='Number of Downloads' sortable={true} />
            {props.download && <Column field='downloadLink' body={downloadTemplate} style={{width:'60px', textAlign: 'center'}} header='Download' /> }
        </DataTable>
        </div>
    );

}

export default ClinGenSetTable;