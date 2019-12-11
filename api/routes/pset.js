const dbUtil = require('../db/dbUtil');
const path = require('path');
const psetDir = path.join(__dirname, '../psets');
const mailer = require('../mailer/mailer');
const request = require('request');

function buildReqArray(parameters, datatype=null){
    var paramArray = [];
    if(!datatype){
        for(let i = 0; i < parameters.length; i++){
            paramArray.push(parameters[i].name);
        }
    }else{
        for(let i = 0; i < parameters.length; i++){
            if(parameters[i].datatype === datatype){
                paramArray.push(parameters[i].name);
            }    
        }
    }
    return(paramArray);
}

function buildPSetObject(reqData){
    var pset = {};
    pset._id = null,
    pset.name = reqData.name;
    pset.status = 'pending';
    pset.download = 0;
    pset.doi = '{ doi: }';
    pset.datasetName = reqData.dataset.name;
    pset.datasetVersion = reqData.dataset.version;
    pset.dataType = buildReqArray(reqData.datatype);
    pset.genome = reqData.genome.name;
    pset.drugSensitivity = reqData.drugSensitivity.name;
    pset.rnaTool = buildReqArray(reqData.toolVersion, 'RNA');
    pset.rnaRef = buildReqArray(reqData.rnaToolRef);
    pset.exomeTool = buildReqArray(reqData.toolVersion, 'DNA');
    pset.exomeRef = buildReqArray(reqData.dnaToolRef);
    pset.metadata = '{ metadata }'
    return(pset);
}

const getPSetByID = function(req, res){
    dbUtil.selectPSetByID(parseInt(req.params.id, 10), function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const getPsetList = function(req, res){
    dbUtil.selectPSets(req.query, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });

}

const getSortedPSets = function(req, res){
    dbUtil.selectSortedPSets(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const postPsetData = function(req, res){
    var pset = buildPSetObject(req.body.reqData);
    dbUtil.insertPSetRequest(pset, req.body.reqData.email, function(result){
        if(result.status){
            console.log('seding request to mock api.')
            request('http://localhost:5000/process/pipeline/' + result.id, function (error, response, body) {
                if(error){
                    res.status(500).send(error);
                }
                res.send(result.data);
            });
        }else{
            res.status(500).send(result.data);
        }
    });
}

const cancelPSetRequest = function(req, res){
    dbUtil.cancelPSetRequest(req.body.psetID, req.body.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const downloadPSets = function(req, res){
    dbUtil.updateDownloadNumber(req.body.psetIDs, function(result){
        if(result.status){
            const file = path.join(psetDir, 'pset1.txt');
            res.zip([{path: file, name: 'pset1.txt'}]);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const updatePSetStatus = function(req, res){
    console.log('request received from mock pachyderm api');
    console.log(req.body);
    
    const url = 'http://localhost:3000/PSet/' + req.body.id;
    const email = 'user1@email.com';
    
    dbUtil.updatePSetStatus(parseInt(req.body.id, 10), function(result){
        if(result.status){
            mailer.sendMail(url, email, (err, info) => {
                if(err){
                    console.log('error: ' + err);
                }
                console.log('info: ' + info);
                res.send({status: 1, message: 'ok'});
            });
        }else{
            console.log('error: ' + result.data);
        }
    });
}

module.exports = {
    getPSetByID,
    getPsetList,
    getSortedPSets,
    postPsetData,
    cancelPSetRequest,
    downloadPSets,
    updatePSetStatus
};
