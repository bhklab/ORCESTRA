import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataTypes } from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';
import AnnotationSetSearch from './AnnotationSetSearch';

const AnnotationSetTable = props => {
    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    });

    const { nameColumnTemplate, downloadTemplate, canonicalTemplate, availableDataTemplate } = useDataTable(
        dataTypes.annotations
    );

    useEffect(() => {
        setState({ ...state, loading: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="table-container">
            <DataTable
                value={props.datasets}
                selection={props.selectedDatasets}
                onSelectionChange={props.updateDatasetSelection}
                paginator={props.datasets.length > 10}
                rows={state.rows}
                resizableColumns={true}
                scrollHeight={props.scrollHeight}
                showGridlines
                size="small"
            >
                {props.authenticated && <Column selectionMode="multiple" style={{ textAlign: 'center' }} />}
                <Column
                    className="textField"
                    field="name"
                    header="Name"
                    style={{ textAlign: 'center' }}
                    body={nameColumnTemplate}
                    sortable={true}
                />
                <Column
                    className="textField"
                    field="dataset.name"
                    header="Dataset"
                    style={{ textAlign: 'center' }}
                    sortable={true}
                />
                <Column field="canonical" body={canonicalTemplate} style={{ textAlign: 'center' }} header="Canonical" />
                <Column
                    field="info.numDownload"
                    style={{ textAlign: 'center' }}
                    header="Number of Downloads"
                    sortable={true}
                />
                {props.download && (
                    <Column
                        field="downloadLink"
                        body={downloadTemplate}
                        style={{ textAlign: 'center' }}
                        header="Download"
                    />
                )}
            </DataTable>
        </div>
    );
};

export default AnnotationSetTable;
