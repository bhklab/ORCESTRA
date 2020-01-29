const mongo = require('../db/mongo');
const path = require('path');
const psetDir = path.join(__dirname, '../psets');
const mailer = require('../mailer/mailer');
const zip = require('express-zip');

const getPSetByDOI = function(req, res){
    const doi = req.params.id1 + '/' + req.params.id2;
    mongo.selectPSetByDOI(doi, function(result){
        if(result.status){
            let date = result.data.dateCreated.toISOString();
            result.data.dateCreated = date.split('T')[0];
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const getPsetList = function(req, res){
    mongo.selectPSets(req.query, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });

}

const getSortedPSets = function(req, res){
    mongo.selectSortedPSets(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const postPsetData = function(req, res){
    mongo.insertPSetRequest(req.pset, req.pset.email, function(result){
        if(result.status){
            console.log('pset inserted to db'); 
            const resData = {summary: 'Request Submitted', message: 'PSet resuest has been submitted successfully.'};  
            res.send(resData);
        }else{
            res.status(500).send(result.data);
        }
    });
    // const resData = {summary: 'Request Submitted', message: 'PSet resuest has been submitted successfully.'};  
    // res.send(resData);
}

const cancelPSetRequest = function(req, res){
    mongo.cancelPSetRequest(req.body.psetID, req.body.username, function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const downloadPSets = function(req, res){
    mongo.updateDownloadNumber(req.body.psetIDs, function(result){
        if(result.status){
            // const file = path.join(psetDir, 'pset1.txt');
            // res.zip([{path: file, name: 'pset1.txt'}]);
            res.send(result);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const sendPSetEmail = function(req, res){
    console.log('request received from mock pachyderm api');
    
    const url = 'http://localhost:3000/' + req.doi;
    const email = req.email;

    mailer.sendMail(url, email, (err, info) => {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
        console.log('email sent');
        res.send({status: 1, message: 'ok'});
    });
}

module.exports = {
    getPSetByDOI,
    getPsetList,
    getSortedPSets,
    postPsetData,
    cancelPSetRequest,
    downloadPSets,
    sendPSetEmail
};
