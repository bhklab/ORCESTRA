const jwt = require('jsonwebtoken');
const mongo = require('../db/mongo');
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
    let pset = {};
    pset._id = null,
    pset.name = reqData.name;
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
    return(pset);
}

module.exports = {
    
    checkToken: function(req, res, next){
        const token = req.cookies.token;
        if(!token){
            res.status(401).send({data: 'Unauthorized: No token provided'});
        }else{
            jwt.verify(token, process.env.KEY, function(err, decoded){
                if(err){
                    res.status(401).send({data: 'Unauthorized: Invalid token'});
                }else{
                    req.username = decoded.username;
                    next();
                }
            });
        }
    },

    getPSetId: function(req, res, next){
        mongo.getId('pset', (result) => {
            if(result.status){
                req.psetId = result.data;
                console.log('pset id: ' + result.data);
                next();
            }else{
                res.status(500).send(result.data);
            }
        });
    },

    sendPSetRequest: function(req, res, next){
        const pset = buildPSetObject(req.body.reqData);
        pset._id =req.psetId;
        pset.status = 'pending';
        request('http://localhost:5000/pipeline/start', {body: {id: req.psetId}, json: true}, function (error, response, body) {
            if(error){
                res.status(500).send(error);
            }
            pset.request = {
                timeSubmitted: Date.now(),
                email: req.body.reqData.email
            };
            req.pset = pset;
            console.log('pset request submitted: ' + pset);
            next();
        });
    }, 

    updatePSetStatus: function(req, res, next){
        mongo.updatePSetStatus(parseInt(req.body.id, 10), function(result){
            if(result.status){
                req.email = result.data.value.request.email;
                req.id = result.data.value._id;
                next();
            }else{
                res.status(500).send(result.data);
            }
        });
    }
}