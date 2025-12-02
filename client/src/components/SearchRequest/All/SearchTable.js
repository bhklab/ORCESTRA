import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataTypes } from '../../Shared/Enums';
import useDataTable from '../../../hooks/useDataTable';

const SearchTable = props => {
    const { psets, selectedPSets, updatePSetSelection, scrollHeight, download, authenticated } = props;

    const { dataTypeTemplate, nameColumnTemplate, downloadTemplate, filteredTemplate, canonicalTemplate } =
        useDataTable(dataTypes.pharmacogenomics);

    const [state, setState] = useState({
        rows: 10,
        first: 0,
        start: 0,
        end: 10,
        totalRecords: 0,
        loading: true
    });

    useEffect(() => {
        setState({ ...state, loading: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="table-container">
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
                showGridlines
            >
                {authenticated && <Column selectionMode="multiple" style={{ textAlign: 'center' }} />}
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
                <Column
                    className="textField"
                    field="dataset.sensitivity.version"
                    header="Drug Sensitivity"
                    style={{ textAlign: 'center' }}
                    sortable={true}
                />
                <Column
                    field="info.filteredSensitivity"
                    body={filteredTemplate}
                    style={{ textAlign: 'center' }}
                    header="Filtered Drug Sensitivity"
                />
                <Column field="tools.rna" style={{ textAlign: 'center' }} header="RNA Tool" sortable={true} />
                <Column field="references.rna" style={{ textAlign: 'center' }} header="RNA Ref" sortable={true} />
                <Column
                    field="availableDatatypes"
                    body={dataTypeTemplate}
                    style={{ textAlign: 'center' }}
                    header="Molecular Data"
                />
                <Column
                    field="info.canonical"
                    body={canonicalTemplate}
                    style={{ textAlign: 'center' }}
                    header="Canonical"
                />
                {download && (
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

export default SearchTable;
