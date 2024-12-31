import React from 'react';
import { data } from './data.js';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import styled from 'styled-components';

export default function TclTable() {
    const Container = styled.div`
        padding: 0 100px 40px 100px;
        min-height: 100vh;
    `;

    const Title = styled.h1`
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 16px;
        text-align: center;
        margin-bottom: 40px;
    `;

    const TableWrapper = styled.div`
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Cell Line Name" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Cellosaurus ID" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Disease Type" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Subtype" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Public Datasets" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Omics Availability" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Single-Agent Testing" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Number of Single-Agents" colSpan={2} headerStyle={{ textAlign: 'center' }} />
                <Column header="Number of Drug Combinations" colSpan={3} headerStyle={{ textAlign: 'center' }} />
                <Column header="Dataset on ORCESTRA" rowSpan={2} headerStyle={{ textAlign: 'center' }} />
            </Row>
            <Row>
                <Column header="Across datasets" headerStyle={{ textAlign: 'center' }} />
                <Column header="TCL38 Pset Only" headerStyle={{ textAlign: 'center' }} />
                <Column header="TCL38 PSet" headerStyle={{ textAlign: 'center' }} />
                <Column header="SYNERGxDB" headerStyle={{ textAlign: 'center' }} />
                <Column header="DrugComb" headerStyle={{ textAlign: 'center' }} />
            </Row>
        </ColumnGroup>
    );

    return (
        <Container>
            <Title>TCL Cell Lines</Title>
            <TableWrapper>
                <DataTable
                    value={data}
                    headerColumnGroup={headerGroup}
                    scrollable
                    paginator
                    rows={8}
                    showGridlines
                    sortable
                >
                    <Column field="cellLineName" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="cellosaurusId" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="diseaseType" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="subtype" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="publicDatasets" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="omicsAvailability" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="singleAgentTesting" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="numberOfSingleAgents.pharmacoDb" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="numberOfSingleAgents.tcl38" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="numberOfDrugCombinations.pharmacoDb" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="numberOfDrugCombinations.tcl38" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="numberOfDrugCombinations.other" bodyStyle={{ textAlign: 'center' }} />
                    <Column field="datasetOnOrcestra" bodyStyle={{ textAlign: 'center' }} />
                </DataTable>
            </TableWrapper>
        </Container>
    );
}
