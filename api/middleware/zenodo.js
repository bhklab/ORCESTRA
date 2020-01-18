const request = require('request');
const fs = require("fs");
const path = require('path');
const zenodoDir = path.join(__dirname, '../zenodo-files');
const zenodoToken = '';

module.exports = {
    getDepositInfo: function(req, res, next){
        request.get('https://sandbox.zenodo.org/api/deposit/depositions', {headers:{'Content-Type': 'application/json'}, body:{}, json: true}, function (error, response, body) {
            if(error){
                res.status(500).send(error);
            }else{
                console.log(response.statusCode);
                // console.log(body[0].id);
                // console.log(body[0].links.files);
                // req.data = {id: body[0].id, links: body[0].links};
                res.send(response);
                //next();
            }
        }).auth(null, null, true, zenodoToken);
    },

    uploadFile: function(req, res, next){
        const url = 'https://sandbox.zenodo.org/api/deposit/depositions/467464/files';
        const uploadRequest = request.post(url, {json: true}, function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                res.send(response);
            }
        }).auth(null, null, true, zenodoToken);
        const form = uploadRequest.form();
        form.append('file', fs.createReadStream(path.join(zenodoDir, 'data.txt')));
    },

    addMetadata: function(req, res, next){
        const data = {
            "metadata": {
                "title": "My first upload",
                "upload_type": "dataset",
                "description": "This is my first upload",
                "creators": [
                    {"name": "Minoru Nakano", "affiliation": "UHN"}
                ]
            }
        }
        
        request({url: 'https://sandbox.zenodo.org/api/deposit/depositions/467464', method: 'PUT', json: data}, function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                res.send(response);
            }
        }).auth(null, null, true, zenodoToken);
    },

    publish: function(req, res, next){
        request.post('https://sandbox.zenodo.org/api/deposit/depositions/467464/actions/publish', function(error, response, body){
            if(error){
                res.status(500).send(error);
            }else{
                res.send(response);
            }
        }).auth(null, null, true, zenodoToken);
    }
}