const mongo = require('../db/mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

function getUser(req, res){
    mongo.selectUser(req.query.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function checkUser(req, res){
    mongo.selectUser(req.query.username, function(result){
        if(result.status){
            if(result.data){
                if(result.data.registered){
                    res.send({exists: true, registered: true});
                }else{
                    res.send({exists: true, registered: false});
                }   
            }else{
                res.send({exists: false, registered: false});
            }
        }else{
            res.status(500).send(result.data);
        }
    });
}

function registerUser(req, res){
    const user = req.body.user;
    bcrypt.hash(user.password, saltRounds, function(err, hashedPwd){
        if(err){
            res.status(500).send(err);
        }else{
            user.password = hashedPwd;
            if(user.exists){
                mongo.registerUser(user, function(result){
                    if(result.status){
                        const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'});
                        res.cookie('token', token, {httpOnly: true}).send({status: 1, authenticated: true, username: user.username});
                    }else{
                        res.status(500).send(result.data);
                    }
                });
            }else{
                mongo.addUser(user, function(result){
                    if(result.status){
                        const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: '1h'});
                        res.cookie('token', token, {httpOnly: true}).send({status: 1, authenticated: true, username: user.username});
                    }else{
                        res.status(500).send(result.data);
                    }
                });
            }
        }
    }); 
}

function loginUser(req, res){
    mongo.selectUser(req.body.user.username, function(result){
        if(result.status){
            if(result.data){
                bcrypt.compare(req.body.user.password, result.data.password, function(err, match){
                    if(err){
                        res.status(500).send({authenticated: false});
                    }
                    if(match){
                        const token = jwt.sign({username: req.body.user.username}, process.env.KEY, {expiresIn: '1h'});
                        res.cookie('token', token, {httpOnly: true}).send({authenticated: true, username: req.body.user.username});
                    }else{
                        res.send({authenticated: false});
                    }
                });
            }else{
                res.send({authenticated: false});
            }      
        }else{
            res.status(500).send(result.data);
        }
    });
}

function getUserPSet(req, res){
    mongo.selectUserPSets(req.query.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function addToUserPset(req, res){
    var userPSet = req.body.reqData;
    mongo.addToUserPset(userPSet, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function removeUserPSet(req, res){
    mongo.removeUserPSets(req.body.username, req.body.psetID, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

function checkToken(req, res){
    res.status(200).send({authenticated: true, username: req.username});
}

function logoutUser(req, res){
    const token = jwt.sign({username: req.params.username}, 'orcestraauthenticationtokenstring', {expiresIn: '0'});
    res.cookie('token', token, {httpOnly: true}).status(200).send();
}

module.exports = {
    getUser,
    checkUser,
    registerUser,
    loginUser,
    getUserPSet,
    addToUserPset,
    removeUserPSet,
    checkToken,
    logoutUser
}