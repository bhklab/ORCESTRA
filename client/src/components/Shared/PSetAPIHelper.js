// Helper functions used for PSet API requests.

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

export function isNoneSelected(filterset){
    if(!filterset.datatype.length && 
        !filterset.datasetName.length && 
        !filterset.datasetVersion.length && 
        !filterset.genome.length && 
        !filterset.rnaTool.length &&
        !filterset.exomeTool.length &&
        !filterset.rnaRef.length &&
        !filterset.exomeRef.length &&
        !filterset.drugSensitivity.length){
        return(true);
    }
    return(false);
}

export function isNotReadyToSubmit(request){
    if(!isSelected(request.reqDatatype)){
        return(true);
    }else if(request.reqDatatype.length === 1){
        if(request.reqDatatype[0] === 'RNA' && !isSelected(request.reqRNAToolRef)){
            return(true);
        }else if(request.reqDatatype[0] === 'DNA' && !isSelected(request.reqDNAToolRef)){
            return(true);
        }
    }else{
        if(!isSelected(request.reqRNAToolRef)){
            return(true);
        }
        if(!isSelected(request.reqDNAToolRef)){
            return(true);
        }
    }

    if(!isSelected(request.reqGenome)){
        return(true);
    } 
    if(!isSelected(request.reqToolVersion)){
        return(true);
    } 
    if(!isSelected(request.reqDataset)){
        return(true);
    }
    if(!isSelected(request.reqDatasetVersion)){
        return(true);
    }
    if(!isSelected(request.reqDrugSensitivity)){
        return(true);
    }
    if(!hasName(request.reqName)){
        return(true);
    }
    if(!isValidEmail(request.reqEmail)){
        return(true);
    }
    return(false);
}

export function isSelected(reqParam){
    if(typeof reqParam === 'undefined' || reqParam === null){
        return(false);
    }
    if(Array.isArray(reqParam) && !reqParam.length){
        return(false);
    }
    return(true);
}

function hasName(name){
    if(typeof name === 'undefined' || name === null){
        return(false);
    }
    if(name.length === 0){
        return(false);
    }
    return(true);
}

function isValidEmail(email){
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(typeof email === 'undefined' || email === null){
        return(false);
    }
    if(email.length === 0){
        return(false);
    }
    if(!regex.test(email)){
        return(false);
    }
    return(true);
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
