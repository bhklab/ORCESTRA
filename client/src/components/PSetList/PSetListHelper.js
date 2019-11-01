import React from 'react';

export const datasetOptions = [
    {name: 'Leuk AML'},
    {name: 'Leuk Cell line'}
];

export const dataVersionOptions = [
    {name: '1.1'},
    {name: '2.2'},
    {name: '3.3'},
    {name: '4.4'},
    {name: '5.5'}
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
    {name: 'Tool 1 version 1.1'},
    {name: 'Tool 2 version 2.1'},
    {name: 'Tool 3 version 3.1'},
    {name: 'Tool 4 version 4.1'}
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
