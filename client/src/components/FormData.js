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
    {name: 'GRCh38'},
    {name: 'GRCh37'}
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

export const rnaToolRefOptions = [
    {name: 'exome_tool_1'},
    {name: 'BWA/0.6.2'},
    {name: 'SNPEff/4.0'},
    {name: 'VarScan/2.3.2'},
    {name: 'MuTect1'}
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