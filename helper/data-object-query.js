/**
 * Contains functions used to build database query objects.
 */

const enums = require('./enum');
const Dataset = require('../new-db/models/dataset');

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
        const datasetIDs = await Dataset.find({name: {$in: parameters.dataset}}).select({_id: 1}).lean();
        query.dataset = {$in: datasetIDs};
    }
    
    // if(parameters.dataType && parameters.dataType.length){
    //     queryArray.push(getQueryFilter('dataType.name', query.dataType.map(dt => {return(dt.name)}), true));
    // }

    if(parameters.genome && parameters.genome.length){
        query.genome = {$in: genome};
    }

    if(parameters.rnaTool && parameters.rnaTool.length){
        query['tools.rna'] = {$in: parameters.rnaTool};
    }

    if(parameters.rnaRef && parameters.rnaRef.length){
        query['references.rna'] = {$in: parameters.rnaRef};
    }

    if(query.canonicalOnly){
        query['info.canonical'] = true;
    }

    if(query.filteredSensitivity){
        query['info.filteredSensitivity'] = true;
    }
    return(query);
}

const getQuerySetForToxicoSet = (parameters) => {

}

const getDefaultQuerySet = (parameters) => {

}
 
const getQuery = async (parameters) => {
    let query = {};
    switch(parameters.datasetType){
        case enums.dataTypes.pharmacogenomics:
            query = await getQuerySetForPSet(parameters);
            break;
        case enums.dataTypes.toxicogenomics:
            query = await getQuerySetForTSet(parameters);
            break;
        default:
            query = await getDefaultQuerySet(parameters);
    }
    query.datasetType = parameters.datasetType;
    return(query);
}

module.exports = {
    getQuery
}