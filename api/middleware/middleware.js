const jwt = require('jsonwebtoken');
const mongo = require('../db/mongo');
const request = require('request');

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

    sendPSetRequest: function(req, res, next){
        let pset = req.body.reqData;
        pset._id = mongo.getObjectID();
        pset.status = 'pending';
        pset.download = 0;
        pset.doi = '';
        request('http://localhost:5000/pipeline/start', {body: {name: pset.name, id: pset._id}, json: true}, function (error, response, body) {
            if(error){
                res.status(500).send(error);
            }
            pset.dateSubmitted = new Date(Date.now()),
            req.pset = pset;
            console.log('pset request submitted: ' + pset);
            next();
        });
    }, 

    updatePSetStatus: function(req, res, next){
        console.log(req.body.update);
        mongo.updatePSetStatus(req.body.update, function(result){
            if(result.status){
                req.email = result.data.value.email;
                req.doi = result.data.value.doi;
                next();
            }else{
                res.status(500).send(result.data);
            }
        });
    }
}