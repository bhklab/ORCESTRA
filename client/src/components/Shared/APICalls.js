
export function queryPSet(api, callback){
    fetch(api)  
        .then(res => res.json())
        .then(resData => {
            callback(resData);
        }   
    );
}

export function saveOrUpdateUserPSets(username, selectedPSets, callback){
    if(selectedPSets.length){
        var userPSet = { username: username };
        var psetId = [];
        for(let i = 0; i < selectedPSets.length; i++){
            psetId.push(selectedPSets[i]._id);
        }
        userPSet.psetId = psetId;

        fetch('/user/pset/add', {
            method: 'POST',
            body: JSON.stringify({reqData: userPSet}),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(resData => callback(1, resData))
            .catch(err => callback(0, err));

    }
}

export function requestPSet(data, callback){
    fetch('/pset/request', {
        method: 'POST',
        body: JSON.stringify({
            reqData: data
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(resData => callback(1, resData))
        .catch(err => callback(0, err));
}

export function downloadPSets(psets, callback){
    var psetIDs = [];
    var download = require('downloadjs');
    console.log(psets);
    for(let i = 0; i < psets.length; i++){
        psetIDs.push(psets[i]._id);
    }
    console.log(psetIDs);
    fetch('/pset/download', {
        method: 'POST',
        body: JSON.stringify({
            psetIDs: psetIDs
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(res => res.blob())
        .then(blob => {
            download(blob, 'pset-' + Date.now() + '.zip');
            callback(1, {message: 'PSet(s) downloaded'});
        })
        .catch(err => callback(0, err));
}