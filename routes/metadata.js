const mongo = require('../db/mongo');
const request = require('request');
const mailer = require('../mailer/mailer');

const getMetadata = function(req, res){
    mongo.selectMetadata(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const getFormData = function(req, res){
    mongo.selectFormData(function(result){
        if(result.status){
            res.send(result.data);
        }else{
            res.status(500).send(result.data);
        }
    });
}

const testRequest = function(req, res){
    console.log('seding request to mock api.')
    request('http://localhost:5000/process/pipeline/15', function (error, response, body) {
        if(error){
            res.status(500).send(error);
        }
        res.send({status: 1, message: obj});
    });
}

const receiveRequest = function(req, res){
    console.log('received from mock pachyderm api');
    console.log(req.body);
    mailer.sendMail((err, info) => {
        if(err){
            console.log('error: ' + err);
        }
        console.log('info: ' + info);
        res.send({status: 1, message: 'ok'});
    });  
}

module.exports = {
    getMetadata,
    getFormData,
    testRequest,
    receiveRequest
};