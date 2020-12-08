/**
 * @fileoverview Contains API functions for dataset retrieval and modification.
 */
const fs = require('fs');
const path = require('path');
const datasetSelect = require('../../db/helper/dataset-select');
const datasetUpdate = require('../../db/helper/dataset-update');
const datasetCanonical = require('../../db/helper/dataset-canonical');
const metricData = require('../../db/helper/metricdata');
const enums = require('../../helper/enum');

function getTabDataForPSet(result){
    let tabData = [];
    tabData.push({header: 'Dataset', data: {dataset: result.dataset, genome: result.genome}})
    let rnaData = [];
    let dnaData = [];

    if(result.rnaTool.length) {rnaData.push({name: 'rnaTool', value: result.rnaTool});}
    if(result.rnaRef.length) {rnaData.push({name: 'rnaRef', value: result.rnaRef});}
    if(result.dataset.versionInfo.rawSeqDataRNA.length) {rnaData.push({name: 'rawSeqDataRNA', value: result.dataset.versionInfo.rawSeqDataRNA});}
    if(result.accompanyRNA.length) {rnaData.push({name: 'accRNA', value: result.accompanyRNA});}
    if(rnaData.length) {tabData.push({header: 'RNA', data: rnaData})}

    if(result.dataset.versionInfo.rawSeqDataDNA.length) {dnaData.push({name: 'rawSeqDataDNA', value: result.dataset.versionInfo.rawSeqDataDNA});}
    if(result.accompanyDNA.length) {dnaData.push({name: 'accDNA', value: result.accompanyDNA});}
    if(dnaData.length) {tabData.push({header: 'DNA', data: dnaData})}

    return tabData;
} 

function getTabDataForToxicoSet(result){
    let tabData = [];
    tabData.push({header: 'Dataset', data: {dataset: result.dataset}});
    return tabData;
}

function getTabDataForXevaSet(result){
    let tabData = [];
    tabData.push({header: 'Dataset', data: {dataset: result.dataset}});
    return tabData;
}

/**
 * Retrives a dataset by datasettype, DOI and parses it into an object form to be used for the single dataset page.
 * @param {*} req 
 * @param {*} res 
 */
const getDatasetByDOI = async function(req, res){
    console.log(`getDatasetByDOI: ${req.params.datasetType}`);
    const doi = req.params.id1 + '/' + req.params.id2;
    console.log(doi)
    try{
        const result = await datasetSelect.selectDatasetByDOI(req.params.datasetType, doi)
        let dataset = {}  
        dataset._id = result._id;
        dataset.name = result.name;
        dataset.downloadLink = result.downloadLink;
        dataset.doi = result.doi;
        dataset.generalInfo = {name: result.name, doi: result.doi, createdBy: result.createdBy, dateCreated: result.dateCreated};
        dataset.tabData = []

        // get molecular tab data for each dataset type
        switch(req.params.datasetType){
            case enums.dataTypes.pharmacogenomics:
                dataset.tabData = getTabDataForPSet(result);
                break;
            case enums.dataTypes.toxicogenomics:
                dataset.tabData = getTabDataForToxicoSet(result);
                break;
            case enums.dataTypes.xenographic:
                dataset.tabData = getTabDataForXevaSet(result);
            default:
                break;
        }

        if(result.pipeline) {dataset.tabData.push({header: 'Pipeline', data: {commitID: result.commitID, config: result.pipeline}})}
        dataset.tabData.push({header: 'Release Notes', data: result.releaseNotes});

        res.send(dataset);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

/**
 * Retrieves filtered datasets.
 * @param {*} req 
 * @param {*} res 
 */
const searchDatasets = async function(req, res){
    console.log(`searchDatasets: ${req.params.datasetType}`);
    try{
        const result = await datasetSelect.selectDatasets(req.params.datasetType, req.body.parameters);
        res.send(result);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}

const getCanonicalDatasets = async function(req, res){
    try{
        const canonical = await datasetCanonical.getCanonicalDatasets(req.params.datasetType);
        res.send(canonical)
    }catch(error){
        res.status(500).send(error);
    }
}

const updateCanonicalPSets = async function(req, res){
    try{
        await datasetUpdate.updateCanonicalStatus(req.body.selected.map(s => {return(s._id)}))
        res.send();
    }catch(error){
        res.status(500).send(error);
    }
}

const downloadDatasets = async function(req, res){
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
const getReleaseNotesData = async function(req, res){
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
    getDatasetByDOI,
    searchDatasets,
    getCanonicalDatasets,
    updateCanonicalPSets,
    downloadDatasets,
    getReleaseNotesData
};
