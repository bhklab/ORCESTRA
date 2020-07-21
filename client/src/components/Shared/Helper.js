// Helper functions used for PSet API requests.

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
    if(!isSelected(request.dataset)){
        return(false)
    }
    if(!isSelected(request.drugSensitivity)){
        return(false);
    }
    if(!hasName(request.name)){return(false)}

    if(!isValidEmail(request.email)){return(false)}

    if(!isSelected(request.genome) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
        return(false);
    }
    if(!isSelected(request.rnaTool) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
        return(false);
    }
    if(!isSelected(request.rnaRef) && !(request.dataset.name === 'CTRPv2' || request.dataset.name === 'FIMM')){
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
