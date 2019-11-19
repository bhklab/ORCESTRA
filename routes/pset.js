const dbUtil = require('../db/dbUtil');
const helper = require('../helper/apiHelper');

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
    pset.status = 'pending';
    pset.doi = '{ doi: }';
    pset.datasetName = reqData.reqDataset.name;
    pset.datasetVersion = reqData.reqDatasetVersion.name;
    pset.dataType = buildReqArray(reqData.reqDatatype);
    pset.genome = reqData.reqGenome.name;
    pset.drugSensitivity = reqData.reqDrugSensitivity.name;
    pset.rnaTool = buildReqArray(reqData.reqToolVersion, 'RNA');
    pset.rnaRef = buildReqArray(reqData.reqRNAToolRef);
    pset.exomeTool = buildReqArray(reqData.reqToolVersion, 'DNA');
    pset.exomeRef = buildReqArray(reqData.reqDNAToolRef);
    pset.metadata = '{ metadata }'
    return(pset);
}

const getPsetList = function(req, res){
    dbUtil.selectPSets(req.query, function(result){
        if(result.status){
            var dataset = helper.restructureData(result.data);
            res.send(dataset);
        }else{
            res.status(500).send(result.data);
        }
    });

}

const postPsetData = function(req, res){
    var pset = buildPSetObject(req.body.reqData);
    dbUtil.insertPSetRequest(pset, req.body.reqData.reqEmail, function(result){
        if(result.status){
            res.send(result.data);
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

module.exports = {
    getPsetList,
    postPsetData,
    cancelPSetRequest
};
