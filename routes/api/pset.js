const psetSelect = require('../../db/helper/pset-select');
const psetUpdate = require('../../db/helper/pset-update');
const psetCanonical = require('../../db/helper/pset-canonical');

const getPSetByDOI = async function(req, res){
    console.log('getPSetByDOI')
    const doi = req.params.id1 + '/' + req.params.id2;
    console.log(doi)
    try{
        const result = await psetSelect.selectPSetByDOI(doi)
        let pset = {}  
        pset._id = result._id;
        pset.name = result.name;
        pset.downloadLink = result.downloadLink;
        pset.doi = result.doi;
        pset.generalInfo = {name: result.name, doi: result.doi, createdBy: result.createdBy, dateCreated: result.dateCreated};
        pset.tabData = []

        // insert tab data
        pset.tabData.push({header: 'Dataset', data: {dataset: result.dataset, genome: result.genome}})
        let rnaData = [];
        let dnaData = [];

        if(result.rnaTool.length) {rnaData.push({name: 'rnaTool', value: result.rnaTool});}
        if(result.rnaRef.length) {rnaData.push({name: 'rnaRef', value: result.rnaRef});}
        if(result.dataset.versionInfo.rawSeqDataRNA.length) {rnaData.push({name: 'rawSeqDataRNA', value: result.dataset.versionInfo.rawSeqDataRNA});}
        if(result.accompanyRNA.length) {rnaData.push({name: 'accRNA', value: result.accompanyRNA});}
        if(rnaData.length) {pset.tabData.push({header: 'RNA', data: rnaData})}
        
        //if(result.dnaTool.length) {dnaData.push({name: 'dnaTool', value: result.dnaTool});}
        //if(result.dnaRef.length) {dnaData.push({name: 'dnaRef', value: result.dnaRef});}
        if(result.dataset.versionInfo.rawSeqDataDNA.length) {dnaData.push({name: 'rawSeqDataDNA', value: result.dataset.versionInfo.rawSeqDataDNA});}
        if(result.accompanyDNA.length) {dnaData.push({name: 'accDNA', value: result.accompanyDNA});}
        if(dnaData.length) {pset.tabData.push({header: 'DNA', data: dnaData})}

        if(result.pipeline) {pset.tabData.push({header: 'Pipeline', data: {commitID: result.commitID, config: result.pipeline}})}

        res.send(pset)
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const searchPSets = async function(req, res){
    console.log('searchPSets');
    try{
        const result = await psetSelect.selectPSets(req.body.parameters);
        res.send(result);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const getCanonicalPSets = async function(req, res){
    try{
        const canonical = await psetCanonical.getCanonicalPSets()
        res.send(canonical)
    }catch(error){
        res.status(500).send(error);
    }
}

const updateCanonicalPSets = async function(req, res){
    try{
        await psetUpdate.updateCanonicalStatus(req.body.selected.map(s => {return(s._id)}))
        res.send();
    }catch(error){
        res.status(500).send(error);
    }
}

const downloadPSets = async function(req, res){
    try{
        console.log(req.body);
        await psetUpdate.updateDownloadCount(req.body.psetID);
        res.send({});
    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    getPSetByDOI,
    searchPSets,
    getCanonicalPSets,
    updateCanonicalPSets,
    downloadPSets
};
