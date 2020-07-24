const psetRequest = require('../../db/helper/pset-request');
const psetUpdate = require('../../db/helper/pset-update');
const mailer = require('../../mailer/mailer');
const request = require('./request');
const pachyderm = require('./pachyderm');

const processOnlineRequest = async function(req, res){
    console.log("completeRequest");
    let resData = {}; 
    try{
        const reqPset = await request.receivePSetRequest(req.body.reqData);
        const config = await request.buildPachydermConfigJson(reqPset);
        await psetRequest.insertPSetRequest(reqPset, reqPset.email, config);
        const online = await pachyderm.checkOnline();
        //const online = false
        if(online){
            console.log('online process');
            await pachyderm.createPipeline(config.config);
            const update = {'dateProcessed': new Date(Date.now()), 'status': 'in-process'};
            const result = await psetUpdate.updatePSetStatus(reqPset._id, update);
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
            await pachyderm.createPipeline(config);
            const update = {'dateProcessed': new Date(Date.now()), 'status': 'in-process'};
            const result = await psetUpdate.updatePSetStatus(req.body.id, update);
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
    }catch(error){
        console.log(error)
        res.status(500)
        resData = {summary: 'Error in Request Process', message: error.message};
    }finally{
        res.send(resData)
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
        const result = await psetUpdate.updatePSetStatus(data.ORCESTRA_ID, update);
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
    processOnlineRequest,
    processOfflineRequest,
    completeRequest
};