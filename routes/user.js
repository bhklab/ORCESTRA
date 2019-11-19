const dbUtil = require('../db/dbUtil');
const helper = require('../helper/apiHelper');

function getUser(req, res){
    console.log(req.query.username);
    dbUtil.selectUser(req.query.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function getUserPSet(req, res){
    dbUtil.selectUserPSets(req.query.username, function(result){
        if(result.status){
            res.send(helper.restructureData(result.data));
        }else{
            res.status(500).send(result.data);
        }
    });
}

function addToUserPset(req, res){
    var userPSet = req.body.reqData;
    dbUtil.addToUserPset(userPSet, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function removeUserPSet(req, res){
    dbUtil.removeUserPSets(req.body.username, req.body.psetID, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

module.exports = {
    getUser,
    getUserPSet,
    addToUserPset,
    removeUserPSet
}