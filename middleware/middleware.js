const path = require('path');
//const configDir = path.join(__dirname, '../../../pachyderm-config');
const configDir = path.join(__dirname, '../../../gray2013pipelines');
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

    receivePSetRequest: function(req, res, next){
        let pset = req.body.reqData;
        pset._id = mongo.getObjectID();
        pset.status = 'pending';
        pset.download = 0;
        pset.doi = 'sample/' + pset._id;
        pset.tempID = '6hdhs8283'; // for development only
        pset.downloadLink = '';
        pset.dateSubmitted = new Date(Date.now());
        req.pset = pset;
        next();
    }, 

    buildPachydermReqJson: function(req, res, next){
        console.log("buildPachydermReqJson");
        const grayPath = path.join(configDir, 'getGRAYP_2013.json');
        const gray2013Raw = fs.readFileSync(grayPath);
        const gray2013 = JSON.parse(gray2013Raw);
        gray2013.transform.cmd.splice(3);
        gray2013.transform.cmd.push(req.pset._id);
        gray2013.update = true;
        gray2013.reprocess = true;

        let json = JSON.stringify(gray2013, null, 2);
        fs.writeFile(path.join(grayPath), json, ()=> {
            req.request = gray2013;
            
            //works
            // let filePath = path.join(__dirname, '../test/getGRAYP_2013.json')
            // let requestRaw = fs.readFileSync(filePath);
            // const request = JSON.parse(requestRaw);
            // request.update = true;
            // request.reprocess = true;
            // req.request = request;

            next();
        });
    },

    pushPachydermReqJson: function(req, res, next){
        console.log("pushPachydermReqJson");
        simpleGit   
            .add('./*')    
            .commit('PSet Request: ' + req.pset._id, (err, data) => {
                if(err){
                    console.log(err)
                }else{
                    console.log(data);
                }
            })
            .push('gray2013', 'master', (err, data) => {
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
        mongo.updatePSetStatusDev(req.body, function(result){
            if(result.status){
                req.email = result.data.value.email;
                req.doi = result.data.value.doi;
                next();
            }else{
                res.status(500).send(result.data);
            }
        });

        //for development only
        // mongo.insertCompleteRequest(req.body, function(result){
        //     if(result.status){
        //         res.send({status: 1, data: req.body});
        //     }else{
        //         res.status(500).send({status: 0, data: 'an error occured'});
        //     }
        // });
    }
}