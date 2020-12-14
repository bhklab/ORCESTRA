const mongo = require('../mongo');
const formdata = require('./formdata');
const metricData = require('./metricdata');
const enums = require('../../helper/enum');

function getQuerySetForPSet(query){
    let querySet = {}
    let queryArray = [];

    if(!query){
        return(querySet);
    } 

    if(query.dataType && query.dataType.length){
        queryArray.push(getQueryFilter('dataType.name', query.dataType.map(dt => {return(dt.name)}), true));
    }
    
    if(query.dataset && query.dataset.length){
        queryArray.push(getQueryFilter('dataset.name', query.dataset.map(ds => {return(ds.name)})));
    }

    if(query.drugSensitivity && query.drugSensitivity.length){
        queryArray.push(getQueryFilter('dataset.versionInfo', query.drugSensitivity.map(dsen => {return(dsen.version)})));
    }

    if(query.genome && query.genome.length){
        queryArray.push(getQueryFilter('genome.name', query.genome.map(g => {return(g.name)})));
    }

    if(query.rnaTool && query.rnaTool.length){
        queryArray.push(getQueryFilter('rnaTool.name', query.rnaTool.map(rt => {return(rt.name)})));
    }

    if(query.rnaRef && query.rnaRef.length){
        queryArray.push(getQueryFilter('rnaRef.name', query.rnaRef.map(rref => {return(rref.name)})));
    }

    if(query.status){
        queryArray.push(getQueryFilter('status', query.status));
    }

    if(query.canonicalOnly){
        queryArray.push(getQueryFilter('canonical', true));
    }

    if(query.filteredSensitivity){
        queryArray.push(getQueryFilter('dataset.filteredSensitivity', true));
    }

    if(queryArray.length){
        querySet = {$and: queryArray};
    }

    return(querySet);
}

function getQuerySetForTSet(query){
    let querySet = {}
    let queryArray = [];

    if(!query){
        return(querySet);
    } 
    
    if(query.dataset && query.dataset.length){
        console.log('get filter')
        queryArray.push(getQueryFilter('dataset.name', query.dataset.map(ds => {return(ds.name)})));
    }

    if(queryArray.length){
        querySet = {$and: queryArray};
    }

    return(querySet);
}

function getQuerySetForXevaSet(query){
    let querySet = {}
    let queryArray = [];

    if(!query){
        return(querySet);
    } 
    
    if(query.dataset && query.dataset.length){
        queryArray.push(getQueryFilter('dataset.name', query.dataset.map(ds => {return(ds.name)})));
    }

    if(queryArray.length){
        querySet = {$and: queryArray};
    }

    return(querySet);
}

function getQueryFilter(keyName, filterValue, all=false){
    var filterObj = {};
    if(!Array.isArray(filterValue)){
        filterObj[keyName] = filterValue;
        return(filterObj);
    }
    filterObj[keyName] = all ? {$all: filterValue} : {$in: filterValue};
    return(filterObj);
}

async function buildPSetObject(pset, formdata){
    let psetObj = await JSON.parse(JSON.stringify(pset))
    const dataset = await formdata.dataset.find(data => {return data.name === pset.dataset.name})
    
    // assign versionInfo metadata
    psetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === pset.dataset.versionInfo})
    
    // assign rnaTool commands
    for(let i = 0; i < psetObj.rnaTool.length; i++){
        psetObj.rnaTool[i].commands = await formdata.rnaTool.find(tool => {return tool.name === psetObj.rnaTool[i].name}).commands
    }

    //assign rnaRef commands
    for(let i = 0; i < psetObj.rnaRef.length; i++){
        const ref = await formdata.rnaRef.find(ref=> {return ref.name === psetObj.rnaRef[i].name})
        psetObj.rnaRef[i].genome = ref.genome
        psetObj.rnaRef[i].source = ref.source
    }
    
    psetObj.accompanyRNA = []
    psetObj.accompanyDNA = []
    let accRNA = psetObj.dataType.filter(dt => {return dt.type === 'RNA' && !dt.default})
    let accDNA = psetObj.dataType.filter(dt => {return dt.type === 'DNA' && !dt.default})

    // assign accompanying RNA and DNA metadata
    if(accRNA.length){
        accRNA.forEach(rna => {
            const data = formdata.accompanyRNA.find(acc => {return (psetObj.dataset.name === acc.dataset && rna.name === acc.name)})
            psetObj.accompanyRNA.push(data)
        })
    }
    if(accDNA.length){
        accDNA.forEach(dna => {
            const data = formdata.accompanyDNA.find(acc => {return (psetObj.dataset.name === acc.dataset && dna.name === acc.name)})
            psetObj.accompanyDNA.push(data)
        })
    }

    return psetObj
}

async function buildToxicoSetObject(tset, formdata){
    let tsetObj = await JSON.parse(JSON.stringify(tset))
    const dataset = await formdata.dataset.find(data => {return data.name === tset.dataset.name})
    
    // assign versionInfo metadata
    tsetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === tset.dataset.versionInfo});

    return tsetObj
}

async function buildXevaSetObject(tset, formdata){
    let tsetObj = await JSON.parse(JSON.stringify(tset))
    const dataset = await formdata.dataset.find(data => {return data.name === tset.dataset.name})
    
    // assign versionInfo metadata
    tsetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === tset.dataset.versionInfo});

    return tsetObj
}

async function buildClinGenSetObject(clingendata, formdata){
    let datasetObj = await JSON.parse(JSON.stringify(clingendata));
    const dataset = await formdata.dataset.find(data => {return data.name === datasetObj.dataset.name});
    
    // assign versionInfo metadata
    datasetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === clingendata.dataset.versionInfo});

    return datasetObj
}

const selectDatasets = async function(datasetType, query, projection=null){     
    console.log(datasetType);
    console.log(query);
    const db = await mongo.getDB();

    try{
        const collection = db.collection(datasetType);
        
        let queryFilter = {}
        switch(datasetType){
            case enums.dataTypes.pharmacogenomics:
                queryFilter = getQuerySetForPSet(query);
                break;
            case enums.dataTypes.toxicogenomics:
                queryFilter = getQuerySetForTSet(query);
                break;
            case enums.dataTypes.xenographic:
                queryFilter = getQuerySetForXevaSet(query);
            default:
                break;
        }

        const data = await collection.find(queryFilter, projection).toArray();
        return data;
    }catch(err){
        console.log(err)
        throw err
    } 
}

const selectDatasetByDOI = async function(datasetType, doi, projection=null){
    const db = await mongo.getDB();
    try{
        const form = await formdata.getFormData(datasetType);

        const datasetCollection = db.collection(datasetType);
        const dataset = await datasetCollection.findOne({'doi': doi, 'status' : 'complete'}, projection);
        let datasetObj = {};
        switch(datasetType){
            case enums.dataTypes.pharmacogenomics:
                datasetObj = await buildPSetObject(dataset, form);
                break;
            case enums.dataTypes.toxicogenomics:
                datasetObj = await buildToxicoSetObject(dataset, form);
                break;
            case enums.dataTypes.xenographic:
                datasetObj = await buildXevaSetObject(dataset, form);
            case enums.dataTypes.clinicalgenomics:
                datasetObj = await buildClinGenSetObject(dataset, form);
            default:
                break;
        }

        // add pipeline config json
        const reqConfigCollection = db.collection('req-config');
        let pipelineConfig = {};
        pipelineConfig = await reqConfigCollection.findOne({'_id': datasetObj._id});
        if(!pipelineConfig){
            const masterConfigCollection = db.collection('req-config-master');
            pipelineConfig = await masterConfigCollection.findOne({'pipeline.name': datasetObj.dataset.versionInfo.pipeline});
        }
        datasetObj.pipeline = pipelineConfig;
        
        // add release notes metrics
        const metrics = await metricData.getMetricDataVersion(datasetType, datasetObj.dataset.name, datasetObj.dataset.versionInfo.version, 'releaseNotes');
        datasetObj.releaseNotes = metrics;

        return datasetObj
    }catch(err){
        console.log(err)
        throw err
    }
}

module.exports = {
    selectDatasets,
    selectDatasetByDOI
}