const mongo = require('../../db/mongo');
const psetRequest = require('../../db/helper/pset-request');

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
            const config  = await psetRequest.getMasterConfig(pset.dataset)

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
                
                const defaultDataType = pset.dataType.find(dt => {return dt.default});
                
                // push RNA tool(s) into input.cross[] - maximum 2
                const toolPrefix = pset.dataset.name.toLowerCase() + '_' + (defaultDataType.name == 'rnaseq' ? 'rnaseq' : 'dnaseq')
                for(let i = 0; i < pset.rnaTool.length; i++){
                    let toolName = toolPrefix + '_' + pset.rnaTool[i].name
                    config.input.cross.push({pfs:{repo: toolName, glob: "/"}})
                }
            }

            if(pset.dataset.name === 'GDSC'){
                const ver = pset.dataset.versionInfo.split('-')[1].slice(0, -1)
                config.transform.cmd.push(ver)
            }

            const accompanyData = pset.dataType.filter(dt => {return !dt.default})
            if(accompanyData.length){
                accompanyData.forEach(acc => {
                    config.transform.cmd.push(acc.name);
                })
            }

            config.transform.cmd.push(pset._id.toString()); // push id as the last element
            config.update = true;
            config.reprocess = true;
            return({config: config, configDir: null, configPath: null});
        }catch(err){
            throw err
        }
    },

    getPachydermConfigJson: async function(id){
        console.log("getPachydermConfigJson");
        const result = await psetRequest.getRequestConfig(id);
        if(result.status){
            console.log('config fetched from db: ' + result.data._id); 
            return(result.data.config);
        }else{
            throw error;
        }
    }
}