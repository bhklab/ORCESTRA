import React from 'react';

export const datasetOptions = [
    {name: 'Leuk AML'},
    {name: 'Leuk Cell line'},
    {name: 'GRAY'}
];

export const dataVersionOptions = [
    {name: '2017'},
    {name: '2019'}
];

export const drugSensitivityOptions = [
    {name: '2017'},
    {name: '2019'}
];

export const genomeOptions = [
    {name: 'GRCh37'},
    {name: 'GRCh38'}
];

export const datatypeOptions = [
    {name: 'RNA'},
    {name: 'DNA'}
];

export const toolVersionOptions = [
    {name: 'exome_tool_1'},
    {name: 'BWA/0.6.2'},
    {name: 'SNPEff/4.0'},
    {name: 'VarScan/2.3.2'},
    {name: 'MuTect1'}
];

export const rnaToolVersionOptions = [
    {name: 'Kallisto/0.44.0', datatype: 'RNA'},
    {name: 'Kallisto/0.43.1', datatype: 'RNA'},
    {name: 'Salmon/11.3', datatype: 'RNA'},
    {name: 'Salmon/11.2', datatype: 'RNA'},
    {name: 'STAR/2.7.0', datatype: 'RNA'},
    {name: 'STAR/2.5.0', datatype: 'RNA'}
];

export const dnaToolVersionOptions = [
    {name: 'MuTect1', datatype: 'DNA'},
    {name: 'MuTect2', datatype: 'DNA'}
];

export const rnaToolRefOptions = [
    {name: 'Ensembl GRCh38 v89 Transcriptome'},
    {name: 'Gencode v23lift37 Transcriptome'},
    {name: 'Ensembl GRCh37 v67 Transcriptome'},
];

export const dnaToolRefOptions = [
    {name: 'GRCh37'},
    {name: 'GRCh38'}
];

// template for the dropdown options
export function dataTemplate(option) {
    return (
        <div className="">
            <span style={{fontSize:'1em',margin:'1em .5em 0 0'}}>{option.name}</span>
        </div>
    );
}

// template for the selected options
export function selectedDataTemplate(item) {
    if (item) {
        return (
            <div className="my-multiselected-item-token">
                <span>{item.name}</span>
            </div>
        );
    }
    else {
        return <span>Select...</span>
    }
}