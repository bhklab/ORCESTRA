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

            // input tool/ref config data if necessary.
            if(pset.rnaTool.length){
                
                let cmdIndex = 2
                
                config.transform.cmd[cmdIndex] = pset.rnaTool[0].label
                cmdIndex++
                
                if(pset.rnaTool.length > 1){
                    config.transform.cmd.splice(cmdIndex, 0, pset.rnaTool[1].label)
                    cmdIndex++
                }

                // replace cmd[3] with reference name
                config.transform.cmd[cmdIndex] = pset.rnaRef[0].name
                
                // push RNA tool(s) into input.cross[] - maximum 2
                let datasetName = pset.dataset.name.toLowerCase()
                if(datasetName === 'gdsc1' || pset.dataset.name === 'gdsc2'){
                    datasetName = datasetName.slice(0, -1)
                }
                const toolPrefix = datasetName + '_' + (pset.dataType[0].name == 'RNA' ? 'rnaseq' : 'dnaseq')
                for(let i = 0; i < pset.rnaTool.length; i++){
                    let toolName = toolPrefix + '_' + pset.rnaTool[i].name
                    config.input.cross.push({pfs:{repo: toolName, glob: "/"}})
                }
            }

            if(pset.dataset.name === 'GDSC1' || pset.dataset.name === 'GDSC2'){
                const ver = pset.dataset.versionInfo.version.split('-')[1].slice(0, -1)
                config.transform.cmd.push(ver)
            }

            config.transform.cmd.push(pset._id.toString()); // push id as the last element
            config.update = true;
            config.reprocess = true;
            return({config: config, configDir: null, configPath: null});
        }catch(err){
            throw err
        }
    },
    
    // not used
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
        const result = await mongo.getRequestConfig(id);
        if(result.status){
            console.log('config fetched from db: ' + result.data._id); 
            return(result.data.config);
        }else{
            throw error;
        }
    }
}