const path = require('path');
const configDir = path.join(__dirname, '../../config');
const mongo = require('../db/mongo');
const fs = require('fs');

module.exports = {
    receivePSetRequest: function(req, res, next){
        console.log('receivePSetRequest');
        let pset = req.body.reqData;
        pset._id = mongo.getObjectID();
        pset.status = 'pending';
        pset.download = 0;
        pset.doi = '';
        pset.downloadLink = '';
        pset.commitID = '';
        pset.dateSubmitted = new Date(Date.now());
        pset.dateProcessed = '';
        pset.dateCreated = '';
        req.pset = pset;
        next();
    }, 

    buildPachydermConfigJson: function(req, res, next){
        console.log("buildPachydermReqJson");
        
        const pipelineDir = 'gray2013pipelines';
        const configFile = 'getGRAYP_2013.json';
        
        const configPath = path.join(configDir, pipelineDir, configFile);
        const configRaw = fs.readFileSync(configPath);
        
        const config = JSON.parse(configRaw);
        config.transform.cmd.splice(3);
        config.transform.cmd.push(req.pset._id);
        config.update = true;
        config.reprocess = true;

        req.config = config;
        req.configDir = path.join(configDir, pipelineDir);
        req.configPath = configPath;
        next();
    },
    
    savePachydermConfigJson: function(req, res, next){
        if(req.isOnline){
            console.log("savePachydermJson");
            let json = JSON.stringify(req.config, null, 2);
            fs.writeFile(req.configPath, json, (err)=> {
                if(err){
                    res.status(500).send(err);
                }else{
                    next();
                }   
            });
        }else{
            next();
        }
    }
}