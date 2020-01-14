const jwt = require('jsonwebtoken');
const mongo = require('../db/mongo');
const request = require('request');
const simpleGit = require('simple-git')('./pachyderm-config/pachyderm-config');
const simpleGitPromise = require('simple-git/promise')('./pachyderm-config/pachyderm-config');
const fs = require('fs');
const path = require('path');
const configDir = path.join(__dirname, '../pachyderm-config/pachyderm-config');

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
        console.log('pset request submitted: ' + pset);
        next();
    }, 

    buildPachydermReqJson: function(req, res, next){
        let pset= req.pset;
        pset.dataset = {label:"GRAY - 2017", name:"GRAY", version:"2017"}
        pset.drugSensitivity = {version:"2017", source:"https://www.synapse.org/#!Synapse:syn8094063"}
        pset.genome = {name:"GRCh38"}
        pset.rnaTool = [{name:"Kallisto/0.43.1", commands:["kallisto index gencode.v23.transcripts.fa.gz -i kallisto_hg38_v23.idx", "kallisto quant  -i kallisto_hg38_v23.idx -o output sample_1.fastq.gz sample_2.fastq.gz"]}];
        pset.rnaRef = [{name:"Gencode v23 Transcriptome", source:"ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_23/gencode.v23.transcripts.fa.gz"}];

        let json = JSON.stringify(pset);
        let fileName = pset._id + '.json';
        //let fileName = 'test.json';
        fs.writeFile(path.join(configDir, fileName), json, 'utf8', ()=> {
            req.pset = pset;
            req.fileName = fileName;
            next();
        });
    },

    pushPachydermReqJson: function(req, res, next){
        console.log("file name: " + req.fileName);
        simpleGit   
            .pull((err, data) => {console.log(data)})    
            .add([req.fileName], (err, data) => {console.log(data)})
            .commit('PSet Request: ' + req.pset._id, (err, data) => {console.log(data)})
            //.addRemote('pachyderm', 'https://github.com/mnakano/pachyderm-config.git')
            .push('pachyderm', 'master', (err, data) => {console.log(data)})
            .exec(next());
    },

    notifyPachyderm: function(req, res, next){

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