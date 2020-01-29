const path = require('path');
const configDir = path.join(__dirname, '../../../pachyderm-config');
//const configDir = path.join(__dirname, '../../../gray2013pipelines');
const jwt = require('jsonwebtoken');
const mongo = require('../db/mongo');
const request = require('request');
const simpleGit = require('simple-git')(configDir);
const fs = require('fs');


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
        //let pset = req.body.reqData;
        let pset = {};
        pset._id = mongo.getObjectID();
        pset.status = 'pending';
        pset.download = 0;
        pset.doi = '';
        pset.email = 'user1@email.com';
        // request('http://localhost:5000/pipeline/start', {body: {name: pset.name, id: pset._id}, json: true}, function (error, response, body) {
        //     if(error){
        //         res.status(500).send(error);
        //     }
        //     pset.dateSubmitted = new Date(Date.now()),
        //     req.pset = pset;
        //     console.log('pset request submitted: ' + pset);
        //     next();
        // });
        pset.dateSubmitted = new Date(Date.now());
        req.pset = pset;
        //console.log('pset request submitted: ' + pset);
        next();
    }, 

    buildPachydermReqJson: function(req, res, next){
        console.log("buildPachydermReqJson");
        const reqID = mongo.getObjectID();
        const grayPath = path.join(configDir, 'getGRAYP_2013.json');
        const gray2013Raw = fs.readFileSync(grayPath);
        const gray2013 = JSON.parse(gray2013Raw);
        gray2013.transform.cmd.splice(3);
        gray2013.transform.cmd.push(reqID);
        gray2013.update = true;
        gray2013.reprocess = true;
        delete gray2013.resource_requests;

        let json = JSON.stringify(gray2013, null, 2);
        fs.writeFile(path.join(grayPath), json, ()=> {
            //gray2013._id = reqID;
            req.request = gray2013;
            req.reqID = reqID;
            //res.send(gray2013);
            next();
        });
    },

    pushPachydermReqJson: function(req, res, next){
        console.log("pushPachydermReqJson");
        simpleGit   
            .add('./*')    
            .commit('PSet Request: ' + req.reqID, (err, data) => {
                if(err){
                    console.log(err)
                }else{
                    console.log(data);
                }
            })
            .push('pachyderm', 'master', (err, data) => {
                if(err){
                    console.log(err);
                }else{
                    console.log('pushPachydermReqJson: pushed');
                }
            })
            .exec(next);
    },

    notifyPachyderm: function(req, res, next){

    },

    updatePSetStatus: function(req, res, next){
        // console.log(req.body.update);
        // mongo.updatePSetStatus(req.body.update, function(result){
        //     if(result.status){
        //         req.email = result.data.value.email;
        //         req.doi = result.data.value.doi;
        //         next();
        //     }else{
        //         res.status(500).send(result.data);
        //     }
        // });

        // for development only
        mongo.insertCompleteRequest(req.body, function(result){
            if(result.status){
                res.send({status: 1, data: req.body});
            }else{
                res.status(500).send({status: 0, data: 'an error occured'});
            }
        });
        
    }
}