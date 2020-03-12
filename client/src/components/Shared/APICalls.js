
export function queryPSet(api, callback){
    //console.log(api);
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

        fetch('/api/user/pset/add', {
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
    console.log(data);
    fetch('/api/pset/request', {
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

export function downloadPSet(psetID){
    console.log('downloadOnePSet: ' + psetID);
    fetch('/api/pset/download', {
        method: 'POST',
        body: JSON.stringify({
            psetID: psetID
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}