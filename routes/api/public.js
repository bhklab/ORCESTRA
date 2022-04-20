/**
 * Contains functions used for publically exposed API calls.
 */
const enums = require('../../helper/enum');
const path = require('path');
const DataObject = require('../../new-db/models/data-object').DataObject;
require('../../new-db/models/dataset');

const getDataVersion = (datasetType, version) => {
    if(version){
        return version;
    }
    if(datasetType === 'pset'){
        return process.env.DEFAULT_DATA_VERSION;
    }
    return '1.0';
}

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
            let repoVersion = getDataVersion(datasetType, req.query.version);
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

const downloadExampleFile = async (req, res) => {
    let filePath = path.join(__dirname, '../../db/documentation-examples', req.params.file);
    res.download(filePath, (err) => {if(err)console.log(err)});
}

// const getDownloadStatistics = async (req, res) => {
//     console.log('getStatistics');
//     let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');
//     try{
//         let result = await datasetSelect.selectDatasets(datasetType, {}, {'projection': {
//             '_id': false,
//             'status': false,
//             'email': false, 
//             'commitID': false, 
//             'dateSubmitted': false,
//             'dateProcessed': false,
//             'rnaTool': false,
//             'rnaRef': false,
//             'dnaTool': false,
//             'dnaRef': false,
//             'genome': false,
//             'dataType': false,
//             'dataset': false
//         }})
//         result.sort((a, b) => (a.download < b.download) ? 1 : -1)
//         let num = parseInt(req.params.limit, 10)
//         num = (isNaN(num) || num >= result.length ? result.length -1 : num)
//         res.send(result.slice(0, num))
//     }catch(error){
//         console.log(error)
//         res.status(500).send(error);
//     }
// }

/**
 * Returns metric data statistics
 * @param {*} req 
 * @param {*} res 
 */
// const getMetricDataStatistics = async (req, res) => {
//     console.log('getMetricDataStatistics');

//     let datasetType = req.params.datasetType.replace(/s([^s]*)$/, '$1');
//     try{
//         let datasetVersions = [];
//         let datasets = await datasetCanonical.getCanonicalDatasets(datasetType, {}, {});
//         if(req.params.dataset !== 'all'){
//             datasets = datasets.find(item => item.dataset === req.params.dataset);
//             datasetVersions = datasets.canonicals.map(item => ({name: item.dataset.name, version: item.dataset.versionInfo}));
//         }else{
//             datasets.forEach(dataset => {
//                 let canonicals = dataset.canonicals.map(item => ({name: item.dataset.name, version: item.dataset.versionInfo}));
//                 datasetVersions = datasetVersions.concat(canonicals);
//             })
//         }

//         let metrics = await metricData.getMetricData(datasetType, '', [...new Set(datasetVersions.map(item => item.name))], true);

//         datasetVersions.forEach(dataset => {
//             let found = metrics.find(metric => metric.name === dataset.name);
//             let metricData = found.versions.find(version => version.version === dataset.version);
//             dataset.genes = metricData.genes;
//             dataset.cellLines = metricData.releaseNotes.cellLines;
//             dataset.drugs = metricData.releaseNotes.drugs;
//             dataset.experiments = metricData.releaseNotes.experiments;
//             dataset.molData = metricData.releaseNotes.molData;
//         });
//         // console.log(datasetVersions);
//         res.send(datasetVersions);
//     }catch(error){
//         console.log(error);
//         res.status(500).send(error);
//     } 
// }

module.exports = {
    getDatasets,
    getDataset,
    updateDownloadCount,
    downloadExampleFile,
    // getDownloadStatistics,
    // getMetricDataStatistics,
}