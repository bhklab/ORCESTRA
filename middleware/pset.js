const mongo = require('../db/mongo');

const getPSetByDOI = function(req, res){
    const doi = req.params.id1 + '/' + req.params.id2;
    mongo.selectPSetByDOI(doi, function(result){
        if(result.status){
            let date = result.data.dateCreated.toISOString();
            result.data.dateCreated = date.split('T')[0];
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const getPsetList = function(req, res){
    mongo.selectPSets(req.query, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });

}

const getSortedPSets = function(req, res){
    mongo.selectSortedPSets(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const postPSetData = async function(req, res, next){
    console.log("postPSetData");
    const result = await mongo.insertPSetRequest(req.pset, req.pset.email, req.config);
    if(result.status){
        console.log('pset inserted to db: ' + req.pset._id); 
        next();
    }else{
        res.status(500).send(result.error);
    }
    next();
}

const completePSetReqProcess = async function(req, res){
    console.log("completePSetReqProcess");
    if(req.isOnline){
        const update = {'dateProcessed': req.dateProcessed, 'status': 'in-process'};
        const result = await mongo.updatePSetStatus(req.id, update);
        if(result.status){
            const resData = {summary: 'Request Submitted', message: 'PSet request has been submitted successfully.'};  
            res.send(resData);
        }else{
            res.status(500).send(result.error);
        }
    }else{
        const resData = {summary: 'Request Submitted', message: 'PSet request has been submitted successfully.'};  
        res.send(resData);
    }
    // const resData = {summary: 'Request Submitted', message: 'PSet request has been submitted successfully.'};  
    // res.send(resData);
}

const cancelPSetRequest = function(req, res){
    mongo.cancelPSetRequest(req.body.psetID, req.body.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const downloadPSets = function(req, res){
    mongo.updateDownloadNumber(req.body.psetIDs, function(result){
        if(result.status){
            // const file = path.join(psetDir, 'pset1.txt');
            // res.zip([{path: file, name: 'pset1.txt'}]);
            res.send(result);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const updatePSetStatus = async function(req, res, next){
    console.log(req.body);
    const data = req.body;
    const update = {
        'status': 'complete', 
        'doi': data.ZENODO_DOI, 
        'downloadLink': data.download_link, 
        'commitID': data.COMMIT, 
        'dateCreated': new Date(Date.now())
    }
    const result = await mongo.updatePSetStatus(data.ORCESTRA_ID, update);
    if(result.status){
        req.email = result.data.value.email;
        req.doi = result.data.value.doi;
        req.download = req.body.download_link;
        next();
    }else{
        res.status(500).send(result.error);
    }
}

module.exports = {
    getPSetByDOI,
    getPsetList,
    getSortedPSets,
    postPSetData,
    completePSetReqProcess,
    cancelPSetRequest,
    downloadPSets,
    updatePSetStatus
};
