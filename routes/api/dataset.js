/**
 * @fileoverview Contains API functions for dataset retrieval and modification.
 */
const fs = require('fs');
const path = require('path');
const datasetSelect = require('../../db/helper/dataset-select');
const datasetUpdate = require('../../db/helper/dataset-update');
const datasetCanonical = require('../../db/helper/dataset-canonical');
const metricData = require('../../db/helper/metricdata');
const auth = require('./auth');
const userdata = require('../../db/helper/userdata');
const enums = require('../../helper/enum');

function getTabData(result, withMolData){
    let tabData = [];
    tabData.push({header: 'Dataset', data: {dataset: result.dataset, genome: result.genome}})

    if(withMolData){
        let rnaData = [];
        let dnaData = [];

        if(result.rnaTool.length) {
            rnaData.push({name: 'rnaTool', value: result.rnaTool});
        }
        if(result.rnaRef.length) {
            rnaData.push({name: 'rnaRef', value: result.rnaRef});
        }
        if(result.dataset.versionInfo.rawSeqDataRNA.length) {
            rnaData.push({name: 'rawSeqDataRNA', value: result.dataset.versionInfo.rawSeqDataRNA});
        }
        if(result.accompanyRNA.length) {
            rnaData.push({name: 'accRNA', value: result.accompanyRNA});
        }
        if(rnaData.length) {
            tabData.push({header: 'RNA', data: rnaData});
        }

        if(result.dataset.versionInfo.rawSeqDataDNA.length) {
            dnaData.push({name: 'rawSeqDataDNA', value: result.dataset.versionInfo.rawSeqDataDNA});
        }
        if(result.accompanyDNA.length) {
            dnaData.push({name: 'accDNA', value: result.accompanyDNA});
        }
        if(dnaData.length) {
            tabData.push({header: 'DNA', data: dnaData});
        }
    }

    return tabData;
} 

/**
 * Retrives a dataset by datasettype, DOI and parses it into an object form to be used for the single dataset page.
 * @param {*} req 
 * @param {*} res 
 */
const getSingleDataset = async (req, res) => {
    console.log(`getDatasetByDOI: ${req.params.datasetType}`);
    const doi = req.params.id1 + '/' + req.params.id2;
    console.log(doi);
    try{
        const result = await datasetSelect.selectDatasetByDOI(req.params.datasetType, doi);
        let dataset = {}  
        dataset._id = result._id;
        dataset.name = result.name;
        dataset.downloadLink = result.downloadLink;
        dataset.doi = result.doi;
        dataset.private = result.private;
        dataset.generalInfo = {name: result.name, doi: result.doi, createdBy: result.createdBy, dateCreated: result.dateCreated};
        dataset.tabData = [];

        // get molecular tab data for each dataset type
        switch(req.params.datasetType){
            case enums.dataTypes.pharmacogenomics:
                dataset.tabData = getTabData(result, true);
                break;
            case enums.dataTypes.toxicogenomics:
                dataset.tabData = getTabData(result);
                break;
            case enums.dataTypes.xenographic:
                dataset.tabData = getTabData(result, true);
                break;
            case enums.dataTypes.clinicalgenomics:
                dataset.tabData = getTabData(result);
                break;
            case enums.dataTypes.radiogenomics:
                dataset.tabData = getTabData(result, true);
            default:
                break;
        }

        console.log(dataset.tabData);

        if(result.pipeline){
            dataset.tabData.push({
                header: 'Pipeline', 
                data: {commitID: result.commitID, config: result.pipeline}
            });
        }
        
        dataset.tabData.push({
            header: 'Release Notes', data: result.releaseNotes
        });

        res.send(dataset);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * checks if the requested dataset is private, and if the user is authorized to access it.
 * @param {*} req 
 * @param {*} res 
 */
const checkPrivate = async (req, res) => {
    console.log(req.params);
    let result = {authorized: false};
    try{
        // check if the dataset is private
        const dataset = await datasetSelect.selectDatasetByDOI(req.params.datasetType, `${req.params.id1}/${req.params.id2}`);
        
        // if private, check if the user is authenticated, and owns the dataset
        if(dataset.private){
            const username = auth.getUsername(req.cookies.orcestratoken);
            if(username){
                const user = await userdata.selectUser(username);
                const userDatasets = user.userDatasets.map(id => id.toString());
                result.authorized = userDatasets.includes(dataset._id.toString());
            }
        }else{
            result.authorized = true;
        }
    }catch(err){
        console.log(err);
    }finally{
        res.send(result);
    }    
}

/**
 * Route used to publish a private dataset
 * @param {*} req 
 * @param {*} res 
 */
const publishDataset = async (req, res) => {
    let result = null;
    try{
        console.log(req.params);
        result = await datasetUpdate.updateDataset(
            req.params.datasetType, 
            {'doi': `${req.params.id1}/${req.params.id2}`}, 
            {'private': false}
        );
    }catch(error){  
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}


/**
 * Retrieves filtered datasets.
 * @param {*} req 
 * @param {*} res 
 */
const searchDatasets = async (req, res) => {
    console.log(`searchDatasets: ${req.params.datasetType}`);
    try{
        const result = await datasetSelect.selectDatasets(req.params.datasetType, req.body.parameters);
        res.send(result);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const getCanonicalDatasets = async (req, res) => {
    try{
        const canonical = await datasetCanonical.getCanonicalDatasets(req.params.datasetType);
        res.send(canonical)
    }catch(error){
        res.status(500).send(error);
    }
}

const updateCanonicalPSets = async (req, res) => {
    try{
        await datasetUpdate.updateCanonicalStatus(req.body.selected.map(s => {return(s._id)}))
        res.send();
    }catch(error){
        res.status(500).send(error);
    }
}

const downloadDatasets = async (req, res) => {
    try{
        console.log(req.body);
        console.log(req.params.datasetType);
        await datasetUpdate.updateDownloadCount(req.params.datasetType, req.body.datasetDOI);
        res.send({});
    }catch(error){
        res.status(500).send(error);
    }
}

/**
 * Returns release notes data for a specific category (cell lines, drugs or experiments)
 * @param {*} req 
 * @param {*} res 
 */
const getReleaseNotesData = async (req, res) => {
    try{
        let currentData;

        // retrieves metric data of a speciried dataset-version for the specific catetory (type)
        const data = await metricData.getMetricDataVersion(req.params.name, req.params.version, req.params.type);

        // if getting data for experiments, data for current experiments table is read from a json file.
        if(req.params.type === 'experiments'){
            const jsonstr = fs.readFileSync(path.join(__dirname, '../../db', 'current-experiments-csv', `${req.params.name}_${req.params.version}_current_experiments.json`), 'utf8');
            currentData = JSON.parse(jsonstr);
        }else{
            currentData  = data[req.params.type].current.map(d => ({name: d}));
        }

        let metrics = {
            name: data.name,
            version: data.version,
            [req.params.type]: {
                current: currentData,
                new: data[req.params.type].new.map(d => ({name: d})),
                removed: data[req.params.type].removed.map(d => ({name: d}))
            }
        }
        res.send(metrics);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    getSingleDataset,
    checkPrivate,
    publishDataset,
    searchDatasets,
    getCanonicalDatasets,
    updateCanonicalPSets,
    downloadDatasets,
    getReleaseNotesData
};
