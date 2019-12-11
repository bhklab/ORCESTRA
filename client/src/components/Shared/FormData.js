import React from 'react';

export const datasetOptions = [
    {name: 'Leuk AML'},
    {name: 'Leuk Cell line'},
    {name: 'GRAY'},
    {name: 'CCLE'}
];

export const dataVersionOptions = [
    {name: '2017'},
    {name: '2019'},
    {name: '2013'}
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
    {name: 'Ensembl GRCh38 v89 Transcriptome', genome: 'GRCh38'},
    {name: 'Gencode v23lift37 Transcriptome', genome: 'GRCh37'},
    {name: 'Ensembl GRCh37 v67 Transcriptome', genome: 'GRCh37'},
];

export const dnaToolRefOptions = [
    {name: 'dbSNP_137.hg19.vcf', genome: 'GRCh37'},
    {name: 'dbSNP_138.hg19.vcf', genome: 'GRCh37'},
    {name: 'GRCh38 dbSNP', genome: 'GRCh38'},
];

// template for the dropdown options
export function dataTemplate(option) {
    return (
        <div className="">
            <span style={{fontSize:'1em',margin:'1em .5em 0 0'}}>{option.name}</span>
        </div>
    );
}

export function datasetTemplate(option) {
    return (
        <div className="">
            <span style={{fontSize:'1em',margin:'1em .5em 0 0'}}>{option.name} - { option.version}</span>
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

export function selectedDatasetTemplate(item) {
    if (item) {
        return (
            <div className="my-multiselected-item-token">
                <span>{item.name} - {item.version}</span>
            </div>
        );
    }
    else {
        return <span>Select...</span>
    }
}