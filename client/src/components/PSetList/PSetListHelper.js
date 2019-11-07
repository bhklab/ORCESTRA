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

export function getFilterSet(dataType, genome, toolVersion, dataset, datasetVersion){
    var filterset = {}
    filterset.datasetVersion = toFilterArray(datasetVersion);
    filterset.datasetName = toFilterArray(dataset);
    filterset.exomeTool = toFilterArray(toolVersion);
    filterset.rnaRef = toFilterArray(genome);
    return(filterset);
}

export function toFilterArray(selectedValues){
    var filterArray = [];
    for(let i = 0; i < selectedValues.length; i++){
        filterArray.push(selectedValues[i].name);
    }
    return(filterArray);
}

export function buildAPIStrFragment(keyName, filterArray){
    var apiFragment = '';
    if(filterArray.length > 0){
        for(let i = 0; i < filterArray.length; i++){
            apiFragment += keyName + '=' + filterArray[i]
            if(i < filterArray.length - 1){
                apiFragment += '&';
            }
        }
    }   
    return(apiFragment);
}

export function buildAPIStr(filterSet){
    let apiStr = '/pset?';
    let apiFragments = [];
    apiFragments.push(buildAPIStrFragment('dsv', filterSet.datasetVersion));
    apiFragments.push(buildAPIStrFragment('dsn', filterSet.datasetName));
    apiFragments.push(buildAPIStrFragment('exot', filterSet.exomeTool));
    apiFragments.push(buildAPIStrFragment('rnar', filterSet.rnaRef));
    for(let i = 0; i < apiFragments.length; i++){
        if(apiFragments[i].length > 0){
            apiStr += apiFragments[i] + '&';
        }
    }
    apiStr = apiStr.replace(/&$/, '');
    return(apiStr);
}
