const mongo = require('../db/mongo');

//middleware
const request = require('./request');
const git = require('./git');
const pachyderm = require('./pachyderm');

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

const postPSetData = async function(pset, email, config){
    console.log("postPSetData");
    const result = await mongo.insertPSetRequest(pset, email, config);
    if(result.status){
        console.log('pset inserted to db: ' + pset._id); 
    }else{
        throw result.error;
    }
}

const completeRequest = async function(req, res){
    console.log("completeRequest");
    let resData = {}; 
    try{
        const reqPset = await request.receivePSetRequest(req.body.reqData);
        const config = await request.buildPachydermConfigJson(reqPset);
        await postPSetData(reqPset, reqPset.email, config);
        const online = await pachyderm.checkOnline();
        if(online){
            console.log('online process');
            await request.savePachydermConfigJson(config.config, config.configPath);
            await git.pushPachydermConfigJson(reqPset._id, config.configDir);
            await pachyderm.createPipeline(config.config);
            const update = {'dateProcessed': new Date(Date.now()), 'status': 'in-process'};
            const result = await mongo.updatePSetStatus(reqPset._id, update);
            if(result.status){
                resData = {
                    summary: 'Request Submitted', 
                    message: 'PSet request has been submitted successfully. You will receive an email when ORCESTRA completes your request.'
                };
            }
        }else{
            console.log('offline process')
            resData = {
                summary: 'Request Submitted', 
                message: 'PSet request has been submitted. Your request will be processed when Pachyderm is online. You will receive an email when ORCESTRA completes your request.'
            }
        }
    }catch(error){
        res.status(500)
        resData = {summary: 'Error in Request Process', message: error.message};
    }finally{
        res.send(resData);
    }
}

const processRequest = async function(req, res){
    console.log("processRequest");
    let resData = {};
    try{
        const online = await pachyderm.checkOnline();
        if(online){
            console.log('online process');
            const config = await request.getPachydermConfigJson(req.body.id);
            await request.savePachydermConfigJson(config.config, config.configPath);
            await git.pushPachydermConfigJson(req.body.id, config.configDir);
            await pachyderm.createPipeline(config.config);
            const update = {'dateProcessed': new Date(Date.now()), 'status': 'in-process'};
            const result = await mongo.updatePSetStatus(req.body.id, update);
            if(result.status){
                resData = {
                    summary: 'Request Submitted', 
                    message: 'PSet request has been submitted successfully. You will receive an email when ORCESTRA completes your request.'
                };
            }
        }else{
            console.log('offline process')
            resData = {
                summary: 'Pachyderm is Offline', 
                message: 'Request could not be submitted. Please try again when Pachyderm is online.'
            }
            res.status(500);
        }
    }catch{
        res.status(500)
        resData = {summary: 'Error in Request Process', message: error.message};
    }finally{
        res.send(resData)
    }
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
    completeRequest,
    processRequest,
    cancelPSetRequest,
    downloadPSets,
    updatePSetStatus
};
