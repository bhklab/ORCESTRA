/**
 * Contains helper functions related to data object API.
 */

const enums = require('./enum');
const Dataset = require('../db/models/dataset');

let baseQuery = {
    'info.status': 'complete',
    'info.private': false
};

/**
 * Returns a query object used to filter PSets
 * @param {*} parameters 
 */
const getQuerySetForPSet = async (parameters) => {
    let query = { ...baseQuery };

    if(parameters.dataset && parameters.dataset.length){
        let datasets = await Dataset.find({name: {$in: parameters.dataset}}).select({_id: 1, name: 1, version: 1}).lean();
        if(parameters.drugSensitivity && parameters.drugSensitivity.length){
            let datasetSensitivity = parameters.drugSensitivity.map(sens => {
                let matches = sens.split(':')[1].match(/\((.*?)\)/g);
                return({
                    dataset: matches[matches.length - 1].replace(/\(|\)/g, ''),
                    version: sens.split(':')[0]
                })
            });
            datasets = datasets.filter(dataset => datasetSensitivity.find(item => item.dataset === dataset.name && item.version === dataset.version));
        }
        query.dataset = {$in: datasets.map(dataset => dataset._id)};
    }
    
    if(parameters.dataType && parameters.dataType.length){
        query['availableDatatypes.name'] = {$in: parameters.dataType};
    }

    if(parameters.genome && parameters.genome.length){
        query.genome = {$in: parameters.genome};
    }

    if(parameters.rnaTool && parameters.rnaTool.length){
        query['tools.rna'] = {$in: parameters.rnaTool};
    }

    if(parameters.rnaRef && parameters.rnaRef.length){
        query['references.rna'] = {$in: parameters.rnaRef};
    }

    if(parameters.canonicalOnly === 'true'){
        query['info.canonical'] = true;
    }

    if(parameters.filteredSensitivity === 'true'){
        query['info.filteredSensitivity'] = true;
    }

    if(parameters.requested){
        query['info.status'] = {$in: ['pending', 'in-process']};
    }
    return(query);
}

const getDefaultQuerySet = async (parameters) => {
    let query = { ...baseQuery };
    if(parameters.dataset && parameters.dataset.length){
        let datasets = await Dataset.find({name: {$in: parameters.dataset}}).select({_id: 1, name: 1, version: 1}).lean();
        query.dataset = {$in: datasets.map(dataset => dataset._id)};
    }
    return(query);
}
 
const getQuery = async (parameters) => {
    let query = {};
    switch(parameters.datasetType){
        case enums.dataTypes.pharmacogenomics:
            query = await getQuerySetForPSet(parameters);
            break;
        default:
            query = await getDefaultQuerySet(parameters);
    }
    query.datasetType = parameters.datasetType;
    return(query);
}

const getDataVersion = (datasetType, version) => {
    if(version){
        return version;
    }
    if(datasetType === 'pset'){
        return process.env.DEFAULT_DATA_VERSION;
    }
    return '1.0';
}

module.exports = {
    getQuery,
    getDataVersion
}