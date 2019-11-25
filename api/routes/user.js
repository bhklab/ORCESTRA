const dbUtil = require('../db/dbUtil');
const helper = require('../helper/apiHelper');

function getUser(req, res){
    dbUtil.selectUser(req.query.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function checkUser(req, res){
    dbUtil.selectUser(req.query.username, function(result){
        if(result.status){
            if(result.data){
                if(result.data.registered){
                    res.send({registered: true});
                }else{
                    res.send({registered: false});
                }   
            }else{
                res.send({registered: false})
            }
        }else{
            res.status(500).send(result.data);
        }
    });
}

function loginUser(req, res){
    dbUtil.selectUser(req.body.user.username, function(result){
        if(result.status){
            if(result.data){
                if(result.data.password === req.body.user.password){
                    res.send({authenticated: true, user: req.body.user.username});
                }else{
                    res.send({authenticated: false});
                } 
            }else{
                res.send({authenticated: false});
            }      
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
    checkUser,
    loginUser,
    getUserPSet,
    addToUserPset,
    removeUserPSet
}