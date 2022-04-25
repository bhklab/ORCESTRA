/**
 * Contains functions used for publically exposed API calls.
 */
const enums = require('../../helper/enum');
const DataObject = require('../../db/models/data-object').DataObject;
const dataObjectHelper = require('../../helper/data-object');
require('../../db/models/dataset');

const parseDataObject = (dataObject, repoVersion) => {
    
    const findDataSource = (dataName) => {
        found = dataObject.dataset.availableData.find(avail => avail.name === dataName);
        return(found ? found.source : null); 
    };

    let repository = dataObject.repositories.find(repo => repo.version === repoVersion);
    return({
        name: dataObject.name,
        doi: repository.doi,
        downloadLink: repository.downloadLink,
        dateCreated: dataObject.info.date.created,
        dataset: {
            name: dataObject.dataset.name,
            versionInfo: {
                version: dataObject.dataset.version,
                type: dataObject.dataset.info ? dataObject.dataset.info.includedData : null,
                publication: dataObject.dataset.publications.map(({_id, ...item}) => item)
            },
            sensitivity: dataObject.dataset.sensitivity
        },
        availableDatatypes: dataObject.availableDatatypes.map(({_id, ...item}) => ({
            ...item,
            source: findDataSource(item.name)
        }))
    });
}

const getDatasets = async (req, res) => {
    let datasetType = req.params.datasetType === 'clinicalgenomics' ? req.params.datasetType : req.params.datasetType.replace(/s([^s]*)$/, '$1');
    let dataTypes = Object.values(enums.dataTypes);
    let results = [];
    try{
        if(dataTypes.includes(datasetType)){
            let repoVersion = dataObjectHelper.getDataVersion(datasetType, req.query.version);
            let filter = { 
                datasetType: datasetType, 
                'info.status': 'complete', 
                'info.private': false,
                'repositories.version': repoVersion
            };
            if(req.params.filter === 'canonical'){
                filter['info.canonical'] = true;
            }

            let dataObjects = await DataObject.find(filter).populate('dataset', {stats: 0}).lean();
            results = dataObjects.map(obj => parseDataObject(obj, repoVersion)); 
        }else{
            results = `Please use the correct dataset type. It should be one of [
                ${dataTypes.map(type => type === 'clinicalgenomics' ? type : type.concat('s')).join(', ')}
            ].`;
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(results);
    }
}

const getDataset = async (req, res) => {
    let dataTypes = Object.values(enums.dataTypes);
    const doi = req.params.doi1 + '/' + req.params.doi2;
    let result = {};
    try{
        if(dataTypes.includes(req.params.datasetType)){
            let filter = { 
                datasetType: req.params.datasetType, 
                'info.status': 'complete', 
                'info.private': false,
                'repositories.doi': doi
            };
            let dataObject = await DataObject.findOne(filter).populate('dataset', {stats: 0}).lean();
            if(dataObject){
                let repository = dataObject.repositories.find(repo => repo.doi === doi);
                result = parseDataObject(dataObject, repository.version); 
            }
        }else{
            result = `Please use the correct dataset type. It should be one of [
                ${dataTypes.join(', ')}
            ].`;
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

/**
 * Used by PharmacoGx to update PSet download count when a user downloads a PSet from ORCESTRA through PharmacoGx
 */
 const updateDownloadCount = async (req, res) => {
    let dataTypes = Object.values(enums.dataTypes);
    const doi = req.params.doi1 + '/' + req.params.doi2;
    let result = {};
    try{
        if(dataTypes.includes(req.params.datasetType)){
            let filter = { 
                datasetType: req.params.datasetType, 
                'info.status': 'complete', 
                'info.private': false,
                'repositories.doi': doi
            };
            await DataObject.updateOne(filter, {$inc: {'info.numDownload': 1}});
            result = 'success';
        }else{
            result = `Please use the correct dataset type. It should be one of [
                ${dataTypes.join(', ')}
            ].`;
        }
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

module.exports = {
    getDatasets,
    getDataset,
    updateDownloadCount
}