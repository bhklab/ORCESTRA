/**
 * @fileoverview Contains API functions for dataset retrieval and modification.
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const datasetSelect = require('../../db/helper/dataset-select');
const datasetUpdate = require('../../db/helper/dataset-update');
const datasetCanonical = require('../../db/helper/dataset-canonical');
const metricData = require('../../db/helper/metricdata');
const auth = require('./auth');
const userdata = require('../../db/helper/userdata');
const enums = require('../../helper/enum');

function getTabData(result, withMolData){
    let tabData = [];
    tabData.push({
        header: 'Dataset', 
        data: {
            dataset: result.dataset, 
            genome: result.genome
        }
    });

    if(result.disclaimer){
        tabData.push({
            header: 'Disclaimer',
            data: result.disclaimer
        })
    }
    
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
        dataset.bioComputeObject = result.bioComputeObject;
        dataset.private = result.private;
        dataset.generalInfo = {
            name: result.name, 
            doi: result.doi, 
            bioComputeDOI: result.bioComputeObject ? result.bioComputeObject.doi : null,
            createdBy: result.createdBy, 
            canonical: result.canonical,
            dateCreated: result.dateCreated
        };
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkPrivate = async (req, res, next) => {
    console.log(req.query);
    try{
        // check if the dataset is private
        const dataset = await datasetSelect.selectDatasetByDOI(req.params.datasetType, `${req.params.id1}/${req.params.id2}`);
            
        // if private, check if the user is authenticated, and owns the dataset
        if(dataset.private){
            const username = auth.getUsername(req.cookies.orcestratoken);
            if(username){
                const user = await userdata.selectUser(username);
                const userDatasets = user.userDatasets.map(id => id.toString());
                let isOwner = userDatasets.includes(dataset._id.toString());
                if(isOwner){
                    req.authorized = true;
                }else if(req.query.shared && req.query.shared.length > 0){
                    req.authorized = req.query.shared === dataset.shareToken;
                }
            }else if(req.query.shared && req.query.shared.length > 0){
                req.authorized = req.query.shared === dataset.shareToken;
            }
        }else{
            req.authorized = true;
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        if(req.authorized){
            next();
        }else{
            res.send({authorized: false});
        }
    }
}

/**
 * checks if the requested dataset is private, and if the user is authorized to access it.
 * @param {*} req 
 * @param {*} res 
 */
const authorizeAccess = async (req, res) => {
    console.log(req.params);
    res.send({authorized: req.authorized});    
}

/**
 * Creates and returns a sharable link to a private dataset if the authenticated user owns the dataset.
 * Only creates a link if it has not been already created.
 * @param {*} req 
 * @param {*} res 
 */
const createPrivateShareLink = async (req, res) => {
    let link = null;
    try{
        const datasetType = req.params.datasetType;
        const doi = `${req.params.id1}/${req.params.id2}`;
        const dataset = await datasetSelect.selectDatasetByDOI(datasetType, doi);
        const user = await userdata.selectUser(req.decoded.username);
        const found = user.userDatasets.map(id => id.toString()).find(item => item === dataset._id.toString());
        if(found){
            if(dataset.shareToken){
                link = `${process.env.BASE_URL}${datasetType}/${doi}?shared=${dataset.shareToken}`;
            }else{
                let uid = uuidv4();
                await datasetUpdate.updateDataset(
                    datasetType,
                    {'doi': doi},
                    {'shareToken': uid} 
                );
                link = `${process.env.BASE_URL}${datasetType}/${doi}?shared=${uid}`;
            }
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }finally{
        res.send(link);
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
        let doi = `${req.params.id1}/${req.params.id2}`;
        let depositionId = doi.split('.').pop();

        // open the repository for editting
        let resp = await axios.post(
            `${process.env.ZENODO_URL}${depositionId}/actions/edit?access_token=${process.env.ZENODO_ACCESS_TOKEN}`
        );
        console.log(resp.status);

        // update the editied data (make the access_right 'open')
        let metadata = resp.data.metadata;
        delete metadata.access_conditions;
        let updated = {
            metadata: {...metadata, access_right: 'open'}
        }    
        resp = await axios.put(
            `${process.env.ZENODO_URL}${depositionId}?access_token=${process.env.ZENODO_ACCESS_TOKEN}`,
            updated
        );
        console.log(resp.status);

        // publish the editted deposition
        resp = await axios.post(
            `${process.env.ZENODO_URL}${depositionId}/actions/publish?access_token=${process.env.ZENODO_ACCESS_TOKEN}`
        );
        console.log(resp.status);

        // make the dataset public
        result = await datasetUpdate.updateDataset(
            req.params.datasetType, 
            {'doi': doi}, 
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
    let result = [];
    try{
        result = await datasetSelect.selectDatasets(req.params.datasetType, req.body.parameters);
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
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
    authorizeAccess,
    createPrivateShareLink,
    publishDataset,
    searchDatasets,
    getCanonicalDatasets,
    updateCanonicalPSets,
    downloadDatasets,
    getReleaseNotesData
};
