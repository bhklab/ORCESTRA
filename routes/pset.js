const dbUtil = require('../db/dbUtil');

function restructureData(dataset){
    tools = '';
    for(i = 0; i < dataset.length; i++){
        dataset[i].rnaTool = flattenArray(dataset[i].rnaTool);
        dataset[i].rnaRef = flattenArray(dataset[i].rnaRef);
        dataset[i].exomeTool = flattenArray(dataset[i].exomeTool);
        dataset[i].exomeRef = flattenArray(dataset[i].exomeRef);
    }
    return dataset;
}

function flattenArray(arrayData){
    var str ='';
    for(let i = 0; i < arrayData.length; i++){
        str += arrayData[i];
        str += '\n';
    }
    return(str);
}

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
            var dataset = restructureData(result.data);
            res.send(dataset);
        }else{
            res.status(500).send(result.data);
        }
    });

}

const postPsetData = function(req, res){
    var pset = buildPSetObject(req.body.reqData);
    dbUtil.insertPSetRequest(pset, function(result){
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
};
