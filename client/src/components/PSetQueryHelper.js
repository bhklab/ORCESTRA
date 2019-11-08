// Helper functions used for PSetFilter component.

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
