const path = require('path');
//const configDir = path.join(__dirname, '../../config');
const mongo = require('../db/mongo');
const fs = require('fs');

module.exports = {
    receivePSetRequest: async function(reqPset){
        console.log('receivePSetRequest');
        let pset = reqPset;
        pset._id = mongo.getObjectID();
        pset.status = 'pending';
        pset.download = 0;
        pset.doi = '';
        pset.downloadLink = '';
        pset.commitID = '';
        pset.dateSubmitted = new Date(Date.now());
        pset.dateProcessed = '';
        pset.dateCreated = '';
        return pset;
    }, 

    buildPachydermConfigJson: async function(pset){
        console.log("buildPachydermReqJson");
        // const pipelineDir = 'gray2013pipelines';
        // const configFile = 'getGRAYP_2013.json';
        // const configPath = path.join(configDir, pipelineDir, configFile);
        // const configRaw = fs.readFileSync(configPath);
        const configName = 'getGRAYP_2013';

        try{
            //const config = JSON.parse(configRaw);
            const config  = await mongo.getMasterConfig(configName)
            config.transform.cmd.splice(3);
            config.transform.cmd.push(pset._id);
            config.update = true;
            config.reprocess = true;
            //const dir = path.join(configDir, pipelineDir);
            return({config: config, configDir: null, configPath: null});
        }catch(err){
            throw err
        }
    },
    
    savePachydermConfigJson: async function(config, configPath){
        console.log("savePachydermJson");
        let json = JSON.stringify(config, null, 2);
        fs.writeFile(configPath, json, (err)=> {
            if(err){
                throw err
            }
        });
    },

    getPachydermConfigJson: async function(id){
        console.log("getPachydermConfigJson");
        // const pipelineDir = 'gray2013pipelines';
        // const configFile = 'getGRAYP_2013.json';
        // const configPath = path.join(configDir, pipelineDir, configFile);
        // const dir = path.join(configDir, pipelineDir);
        const result = await mongo.getRequestConfig(id);
        if(result.status){
            console.log('config fetched from db: ' + result.data._id); 
            return({config: result.data, configDir: dir, configPath: configPath});
        }else{
            throw error;
        }
    }
}