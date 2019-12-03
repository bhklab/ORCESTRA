// Helper functions used for PSet API requests.

export function getFilterSet(data){
    var filterset = {}
    filterset.datatype = toFilterArray(data.datatype);
    filterset.datasetName = toFilterArray(data.dataset);
    filterset.datasetVersion = toFilterArray(data.datasetVersion);
    filterset.genome = toFilterArray(data.genome);
    filterset.rnaTool = toToolVersionFilterArray(data.toolVersion, 'RNA');
    filterset.exomeTool = toToolVersionFilterArray(data.toolVersion, 'DNA');
    filterset.rnaRef = toFilterArray(data.rnaRef);
    filterset.exomeRef = toFilterArray(data.dnaRef);
    filterset.drugSensitivity = toFilterArray(data.drugSensitivity);
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
    if(!isSelected(request.datatype)){
        return(true);
    }else if(request.datatype.length === 1){
        if(request.datatype[0] === 'RNA' && !isSelected(request.rnaToolRef)){
            return(true);
        }else if(request.datatype[0] === 'DNA' && !isSelected(request.dnaToolRef)){
            return(true);
        }
    }else{
        if(!isSelected(request.rnaToolRef)){
            return(true);
        }
        if(!isSelected(request.dnaToolRef)){
            return(true);
        }
    }

    if(!isSelected(request.genome)){
        return(true);
    } 
    if(!isSelected(request.toolVersion)){
        return(true);
    } 
    if(!isSelected(request.dataset)){
        return(true);
    }
    if(!isSelected(request.datasetVersion)){
        return(true);
    }
    if(!isSelected(request.drugSensitivity)){
        return(true);
    }
    if(!hasName(request.name)){
        return(true);
    }
    if(!isValidEmail(request.email)){
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

export function messageAfterRequest(status, data, initalize=null, msgComponent){
    if(initalize){
        initalize();
    }
    if(status){
        msgComponent.show({severity: 'success', summary: data.summary, detail: data.message});
    }else{
        msgComponent.show({severity: 'error', summary: 'An error occured', detail: data.toString(), sticky: true});
    } 
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
