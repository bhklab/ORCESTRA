const dbUtil = require('../db/dbUtil');

function getUser(){

}

function updateUserPset(req, res){
    var userPSet = req.body.reqData;
    dbUtil.updateUserPset(userPSet, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

module.exports = {
    getUser,
    updateUserPset
}