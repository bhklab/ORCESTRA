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
        console.log(pset)
        try{
            const config  = await mongo.getMasterConfig(pset.dataset.versionInfo.pipeline)
            // check if pipeline is fimm or CTRP
            if(pset.dataset.versionInfo.pipeline != 'fimm' || pset.dataset.versionInfo.pipeline != 'get_CTRP'){
                // replace cmd[2] with tool label
                config.transform.cmd[2] = pset.rnaTool[0].label
                
                // replace cmd[3] with reference name
                config.transform.cmd[3] = pset.rnaRef[0].name
                
                // push RNA tool(s) into input.cross[] - maximum 2
                const toolPrefix = pset.dataset.name.toLowerCase() + '_' + (pset.dataType.name == 'RNA' ? 'rnaseq' : 'dnaseq')
                for(let i = 0; i < pset.rnaTool.length; i++){
                    let toolName = toolPrefix + '_' + pset.rnaTool[i].name
                    config.input.cross.push({pfs:{repo: toolName, glob: "/"}})
                }
            }
            config.transform.cmd.push(pset._id.toString()); // push id as the last element
            config.update = true;
            config.reprocess = true;
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