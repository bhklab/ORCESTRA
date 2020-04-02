// Helper functions used for PSet API requests.

export function getFilterSet(data){
    var filterset = {}
    filterset.datatype = toFilterArray(data.dataType);
    filterset.datasetName = toFilterArray(data.dataset);
    filterset.genome = toFilterArray(data.genome);
    filterset.rnaTool = toFilterArray(data.rnaTool);
    filterset.dnaTool = toFilterArray(data.dnaTool);
    filterset.rnaRef = toFilterArray(data.rnaRef);
    filterset.dnaRef = toFilterArray(data.dnaRef);
    filterset.drugSensitivity = toFilterArray(data.drugSensitivity, true);
    return(filterset);
}

export function buildAPIStr(filterSet){
    let apiStr = '/api/pset?status=complete&';
    let apiFragments = [];
    apiFragments.push(buildAPIStrFragment('dtp', filterSet.datatype));
    apiFragments.push(buildAPIStrFragment('dsn', filterSet.datasetName));
    apiFragments.push(buildAPIStrFragment('gnm', filterSet.genome));
    apiFragments.push(buildAPIStrFragment('rnat', filterSet.rnaTool));
    apiFragments.push(buildAPIStrFragment('dnat', filterSet.dnaTool));
    apiFragments.push(buildAPIStrFragment('rnar', filterSet.rnaRef));
    apiFragments.push(buildAPIStrFragment('dnar', filterSet.dnaRef));
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
        !filterset.genome.length && 
        !filterset.rnaTool.length &&
        !filterset.dnaTool.length &&
        !filterset.rnaRef.length &&
        !filterset.dnaRef.length &&
        !filterset.drugSensitivity.length){
        return(true);
    }
    return(false);
}

export function isReadyToSubmit(request){
    if(!isSelected(request.dataType)){return(false)}

    if(!isSelected(request.genome)){return(false)}

    if(!hasName(request.name)){return(false)}

    if(!isValidEmail(request.email)){return(false)}
    
    if(!isSelected(request.dataset)){
        return(false)
    }else if(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM'){
        return(true)
    }
    
    if(!isSelected(request.rnaRef)){return(false)}

    if(!isSelected(request.rnaTool)){return(false)}

    // if(!isSelected(request.dnaRef)){
    //     return(true);
    // }
    // if(!isSelected(request.dnaTool)){
    //     return(true);
    // }

    if(!isSelected(request.drugSensitivity)){
        return(false);
    }

    return(true);
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

export function messageAfterRequest(status, data, initialize=null, msgComponent){
    if(initialize){
        initialize();
    }
    if(status){
        msgComponent.show({severity: 'success', summary: data.summary, detail: data.message, sticky: true});
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

function toFilterArray(selectedValues, isDatasetVersion = false){
    var filterArray = [];
    if(typeof selectedValues === 'undefined' || selectedValues === null){
        return(filterArray);
    }
    if(Object.keys(selectedValues).length === 0 && selectedValues.constructor === Object){
        return(filterArray);
    }
    if(Array.isArray(selectedValues)){
        if(isDatasetVersion){
            for(let i = 0; i < selectedValues.length; i++){   
                filterArray.push(selectedValues[i].version);
            }
        }else{
            for(let i = 0; i < selectedValues.length; i++){   
                filterArray.push(selectedValues[i].name);
            }
        }
        return(filterArray);
    } 
    if(isDatasetVersion){
        filterArray.push(selectedValues.version);
    }else{
        filterArray.push(selectedValues.name);
    }
    return(filterArray);
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
