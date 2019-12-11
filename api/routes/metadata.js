const dbUtil = require('../db/dbUtil');

const getMetadata = function(req, res){
    dbUtil.selectMetadata(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const getFormData = function(req, res){
    dbUtil.selectFormData(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

module.exports = {
    getMetadata,
    getFormData
};