/**
 * @fileoverview Includes functions that handles PSet request.
 */
const psetRequest = require('../../db/helper/pset-request');
const datasetUpdate = require('../../db/helper/dataset-update');
const mailer = require('../../mailer/mailer');
const request = require('./request');
const pachyderm = require('./pachyderm');

/**
 * Handles incoming PSet requests by the users.
 * Builds a PSet object according to the request.
 * Builds a Pachyderm config json object according to the request.
 * Stores the PSet object into DB.
 * Checks if Pachyderm is online.
 * Process the request if online.
 * Send a request notification email to admin@orcestra.ca if offline.
 * @param {*} req 
 * @param {*} res 
 */
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
            const result = await datasetUpdate.updatePSetStatus(reqPset._id, update);
            if(result.status){
                resData = {
                    summary: 'Request Submitted', 
                    message: 'PSet request has been submitted successfully. You will receive an email when ORCESTRA completes your request.'
                };
            }
        }else{
            console.log('offline process');
            await mailer.sendPSetReqEmail(reqPset._id, reqPset.name, reqPset.dateSubmitted);
            resData = {
                summary: 'Request Submitted', 
                message: 'PSet request has been submitted. Your request will be processed when Pachyderm is online. You will receive an email when ORCESTRA completes your request.'
            };
        }
    }catch(error){
        console.log(error)
        res.status(500)
        resData = {summary: 'Error in Request Process', message: error.message};
    }finally{
        res.send(resData);
    }
}

/**
 * Triggers PSet request processing when manually pushed by admin.
 * Checks if Pachyderm is online.
 * If online, retrieves the json config file, creates pipeline and update PSet status.
 * @param {*} req 
 * @param {*} res 
 */
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
            const result = await datasetUpdate.updatePSetStatus(req.body.id, update);
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

/**
 * Handles post-pipeline processing request from Pachyderm.
 * Recieves post-pipeline request, updates the database and sends email to the user.
 * @param {*} req 
 * @param {*} res 
 */
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
        const result = await datasetUpdate.updatePSetStatus(data.ORCESTRA_ID, update);
        console.log('update complete')
        const url = process.env.BASE_URL + 'pharmacogenomics/' + result.data.value.doi
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