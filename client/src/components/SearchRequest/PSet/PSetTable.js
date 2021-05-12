import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { dataTypes } from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';

const PSetTable = (props) => {

    const { 
        psets, 
        selectedPSets, 
        updatePSetSelection, 
        scrollHeight, 
        download, 
        authenticated, 
    } = props;

    const {
        toolsRefTemplate,
        dataTypeTemplate,
        nameColumnTemplate,
        downloadTemplate,
        filteredTemplate,
        canonicalTemplate
    } = useDataTable(dataTypes.pharmacogenomics);
    
    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    });

    useEffect(()=>{
        setState({...state, loading: false});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <DataTable 
            value={psets} 
            selection={selectedPSets} 
            onSelectionChange={updatePSetSelection} 
            paginator={true} 
            rows={state.rows} 
            resizableColumns={true} 
            columnResizeMode="fit"
            scrollable={true} 
            scrollHeight={scrollHeight}
        >
            {
                authenticated && 
                <Column selectionMode="multiple" style={{width: '40px', textAlign: 'center'}} />
            }
            <Column className='textField' field='name' header='Name' style={{width:'150px'}} body={nameColumnTemplate} sortable={true} />
            <Column className='textField' field='dataset.name' header='Dataset' style={{width:'100px'}} sortable={true} />
            <Column className='textField' field='dataset.versionInfo' header='Drug Sensitivity' style={{width:'120px'}} sortable={true} />
            <Column field='dataset.filteredSensitivity' body={filteredTemplate} style={{width:'90px', textAlign: 'center'}} header='Filtered Drug Sensitivity' />
            <Column field='rnaTool' body={toolsRefTemplate} style={{width:'120px'}} header='RNA Tool' sortable={true}  />
            <Column field='rnaRef' body={toolsRefTemplate} style={{width:'120px'}} header='RNA Ref' sortable={true} />
            <Column field='dataType' body={dataTypeTemplate} style={{width:'125px'}} header='Molecular Data' />
            <Column field='canonical' body={canonicalTemplate} style={{width:'90px', textAlign: 'center'}} header='Canonical' />
            {
                download && 
                <Column field='downloadLink' body={downloadTemplate} style={{width:'90px', textAlign: 'center'}} header='Download' /> 
            }
        </DataTable>
    );

}

export default PSetTable;