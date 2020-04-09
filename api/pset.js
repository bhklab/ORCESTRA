const mongo = require('../db/mongo');
const mailer = require('../mailer/mailer');

//middleware
const request = require('./request');
const pachyderm = require('./pachyderm');

const getPSetByDOI = async function(req, res){
    const doi = req.params.id1 + '/' + req.params.id2;
    try{
        const result = await mongo.selectPSetByDOI(doi)
        let date = result.dateCreated.toISOString();
        result.dateCreated = date.split('T')[0];
        res.send(result)
    }catch(error){
        res.status(500).send(error);
    }
}

const getPsetList = async function(req, res){
    try{
        const result = await mongo.selectPSets(req.query)
        res.send(result)
    }catch(error){
        res.status(500).send(error);
    }
}

const getSortedPSets = async function(req, res){
    try{
        const result = await mongo.selectSortedPSets()
        res.send(result)
    }catch(error){
        res.status(500).send(error);
    }
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

const processOnlineRequest = async function(req, res){
    console.log("completeRequest");
    let resData = {}; 
    try{
        const reqPset = await request.receivePSetRequest(req.body.reqData);
        const config = await request.buildPachydermConfigJson(reqPset);
        await postPSetData(reqPset, reqPset.email, config);
        const online = await pachyderm.checkOnline();
        //const online = false
        if(online){
            console.log('online process');
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
        console.log(error)
        res.status(500)
        resData = {summary: 'Error in Request Process', message: error.message};
    }finally{
        res.send(resData);
    }
}

const processOfflineRequest = async function(req, res){
    console.log("processRequest");
    let resData = {};
    try{
        const online = await pachyderm.checkOnline();
        if(online){
            console.log('online process');
            const config = await request.getPachydermConfigJson(req.body.id);
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

// const cancelPSetRequest = function(req, res){
//     mongo.cancelPSetRequest(req.body.psetID, req.body.username, function(result){
//         if(result.status){
//             res.send(result.data);
//         }else{
//             res.status(500).send(result.data);
//         }
//     });
// }

const downloadPSets = async function(req, res){
    try{
        await mongo.updateDownloadNumber(req.body.psetID)
        res.send({})
    }catch(error){
        res.status(500).send(error);
    }
}

const completeRequest = async function(req, res){
    console.log('complete request');
    const data = req.body;
    const update = {
        'status': 'complete', 
        'doi': data.ZENODO_DOI, 
        'downloadLink': data.download_link, 
        'commitID': data.COMMIT, 
        'dateCreated': new Date(Date.now())
    }
    try{
        const result = await mongo.updatePSetStatus(data.ORCESTRA_ID, update);
        console.log('update complete')
        const url = process.env.BASE_URL + result.data.value.doi
        await mailer.sendMail(url, result.data.value.doi, result.data.value.email, req.body.download_link)
        res.send({status: 'OK'})
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
}

module.exports = {
    getPSetByDOI,
    getPsetList,
    getSortedPSets,
    postPSetData,
    processOnlineRequest,
    processOfflineRequest,
    //cancelPSetRequest,
    downloadPSets,
    completeRequest
};
