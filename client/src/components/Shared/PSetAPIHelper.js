// Helper functions used for PSetFilter component.

export function getFilterSet(datatype, genome, toolVersion, dataset, datasetVersion, drugSensitivity, rnaRef, dnaRef){
    var filterset = {}
    filterset.datatype = toFilterArray(datatype);
    filterset.datasetName = toFilterArray(dataset);
    filterset.datasetVersion = toFilterArray(datasetVersion);
    filterset.genome = toFilterArray(genome);
    filterset.rnaTool = toToolVersionFilterArray(toolVersion, 'RNA');
    filterset.exomeTool = toToolVersionFilterArray(toolVersion, 'DNA');
    filterset.rnaRef = toFilterArray(rnaRef);
    filterset.exomeRef = toFilterArray(dnaRef);
    filterset.drugSensitivity = toFilterArray(drugSensitivity);
    return(filterset);
}

function toFilterArray(selectedValues){
    var filterArray = [];
    if(typeof selectedValues === 'undefined' || selectedValues === null){
        return(filterArray);
    }
    if(Object.keys(selectedValues).length === 0 && selectedValues.constructor === Object){
        return(filterArray);
    }
    if(Array.isArray(selectedValues)){
        for(let i = 0; i < selectedValues.length; i++){   
            filterArray.push(selectedValues[i].name);
        }
        return(filterArray);
    }  
    filterArray.push(selectedValues.name);
    return(filterArray);
}

function toToolVersionFilterArray(selectedValues, datatype){
    var filterArray = [];
    for(let i = 0; i < selectedValues.length; i++){   
        if(selectedValues[i].datatype === datatype)
        filterArray.push(selectedValues[i].name);
    }
    return filterArray;
}

export function buildAPIStr(filterSet){
    let apiStr = '/pset?';
    let apiFragments = [];
    apiFragments.push(buildAPIStrFragment('dtp', filterSet.datatype));
    apiFragments.push(buildAPIStrFragment('dsv', filterSet.datasetVersion));
    apiFragments.push(buildAPIStrFragment('dsn', filterSet.datasetName));
    apiFragments.push(buildAPIStrFragment('gnm', filterSet.genome));
    apiFragments.push(buildAPIStrFragment('rnat', filterSet.rnaTool));
    apiFragments.push(buildAPIStrFragment('exot', filterSet.exomeTool));
    apiFragments.push(buildAPIStrFragment('rnar', filterSet.rnaRef));
    apiFragments.push(buildAPIStrFragment('exor', filterSet.exomeRef));
    apiFragments.push(buildAPIStrFragment('dst', filterSet.drugSensitivity));
    for(let i = 0; i < apiFragments.length; i++){
        if(apiFragments[i].length > 0){
            apiStr += apiFragments[i] + '&';
        }
    }
    apiStr = apiStr.replace(/&$/, '');
    return(apiStr);
}

function buildAPIStrFragment(keyName, filterArray){
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
