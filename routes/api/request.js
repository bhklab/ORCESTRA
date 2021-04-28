/**
 * Contains functions that handles a PSet request.
 */
const mongo = require('../../db/mongo');
const psetRequest = require('../../db/helper/pset-request');

/**
 * Builds Pachyderm config json object from a PSet object.
 * @param {*} pset 
 */
const buildPachydermConfigJson = async (datasetType, dataset) => {
    console.log("buildPachydermReqJson");
    console.log(dataset)
    try{
        const config  = await psetRequest.getMasterConfig(datasetType, dataset.dataset)

        // input tool/ref config data if necessary.
        if(dataset.rnaTool.length){
            
            let cmdIndex = 2
            
            config.transform.cmd[cmdIndex] = dataset.rnaTool[0].label
            cmdIndex++
            
            if(dataset.rnaTool.length > 1){
                config.transform.cmd.splice(cmdIndex, 0, dataset.rnaTool[1].label)
                cmdIndex++
            }

            // replace cmd[3] with reference name
            config.transform.cmd[cmdIndex] = dataset.rnaRef[0].name
            
            const defaultDataType = dataset.dataType.find(dt => {return dt.default});
            
            // push RNA tool(s) into input.cross[] - maximum 2
            const toolPrefix = (dataset.dataset.name.toLowerCase() === 'uhnbreast' ? 'uhn' : dataset.dataset.name.toLowerCase()) + '_' + (defaultDataType.name === 'rnaseq' ? 'rnaseq' : 'dnaseq')
            for(let i = 0; i < dataset.rnaTool.length; i++){
                let toolName = toolPrefix + '_' + dataset.rnaTool[i].name
                config.input.cross.push({pfs:{repo: toolName, glob: "/"}})
            }
        }

        if(dataset.dataset.name === 'GDSC'){
            const ver = dataset.dataset.versionInfo.split('-')[1].slice(0, -1)
            config.transform.cmd.push(ver)
        }

        const accompanyData = dataset.dataType.filter(dt => {return !dt.default})
        if(accompanyData.length){
            accompanyData.forEach(acc => {
                config.transform.cmd.push(acc.name);
            })
        }

        if(dataset.dataset.filteredSensitivity){
            // push the filtered designation if dataset.filteredSensitivity is true
            config.transform.cmd.push('filtered'); 
        }

        if(dataset.dataset.name === 'GDSC'){
            // if microarray is selected as accomnapying data, insert microarray type.
            let microarray = accompanyData.find(item => (item.name === 'microarray'));
            if(microarray){
                config.transform.cmd.push(microarray.type.name); 
            }
        }

        config.transform.cmd.push(dataset._id.toString()); // push id as the last element
        config.update = true;
        config.reprocess = true;
        return({config: config, configDir: null, configPath: null});
    }catch(err){
        throw err
    }
}

/**
 * Retrieves Pachyderm config json object by request ID.
 * @param {*} id 
 */
const getPachydermConfigJson = async (id) => {
    console.log("getPachydermConfigJson");
    const result = await psetRequest.getRequestConfig(id);
    if(result.status){
        console.log('config fetched from db: ' + result.data._id); 
        return(result.data.config);
    }else{
        throw error;
    }
}

module.exports = {
    buildPachydermConfigJson,
    getPachydermConfigJson
}