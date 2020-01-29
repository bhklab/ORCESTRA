const request = require('request');
const fs = require("fs");
const path = require('path');
const zenodoDir = path.join(__dirname, '../zenodo-files');
const zenodoToken = 'ICMDE5AK6M9BJryIrATkfSjvqYL9v5Af2vFmXg7Bh7yKoQ4gFw4nYzftCpGa';
const zenodoBaseURL = 'https://sandbox.zenodo.org/api/deposit/depositions'

module.exports = {
    getDepositInfo: function(req, res, next){
        request.post(zenodoBaseURL, {headers:{'Content-Type': 'application/json'}, body:{}, json: true}, function (error, response, body) {
            if(error){
                res.status(500).send(error);
            }else{
                console.log('depository created');
                console.log(body);
                req.data = {id: body.id, download: '', doi: ''};
                //res.send(response);
                next();
            }
        }).auth(null, null, true, zenodoToken);
    },

    uploadFile: function(req, res, next){
        const url = zenodoBaseURL + '/' + req.data.id + '/files'; // req.data.links.files
        const uploadRequest = request.post(url, {json: true}, function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                console.log('file uploaded');
                console.log(body);
                req.data.download = body.links.download;
                //res.send(response);
                next();
            }
        }).auth(null, null, true, zenodoToken);
        const form = uploadRequest.form();
        form.append('file', fs.createReadStream(path.join(zenodoDir, req.params.name)));
    },

    addMetadata: function(req, res, next){
        const data = {
            "metadata": {
                "title": "PSet " + req.params.name,
                "upload_type": "dataset",
                "description": "The details can be viewed at: orcestra.ca", 
                "creators": [
                    {"name": "ORCESTRA", "affiliation": "UHN"}
                ]
            }
        }

        const url = zenodoBaseURL + '/' + req.data.id; // req.data.links.self

        request({url: url, method: 'PUT', json: data}, function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                console.log('metadata added');
                console.log(body);
                //res.send(response);
                next();
            }
        }).auth(null, null, true, zenodoToken);
    },

    publish: function(req, res, next){
        request.post(zenodoBaseURL + '/' + req.data.id + '/actions/publish', function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                const bodyData = JSON.parse(body);
                console.log('file published');
                console.log(bodyData);
                req.data.doi = bodyData.doi
                console.log(req.data);
                res.send({status: 1, message: 'upload success', data: req.data});
            }
        }).auth(null, null, true, zenodoToken);
    }
}