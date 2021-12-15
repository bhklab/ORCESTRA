const mongo = require('../mongo');
const formdata = require('./formdata');
const metricData = require('./metricdata');
const datasetNotes = require('./dataset-notes');
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

    queryArray.push(getQueryFilter('private', typeof query.private !== 'undefined' ? query.private : false));

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

function getDefaultQuerySet(query){
    let querySet = {}
    let queryArray = [];

    if(!query){
        return(querySet);
    } 
    
    if(query.dataset && query.dataset.length){
        queryArray.push(getQueryFilter('dataset.name', query.dataset.map(ds => {return(ds.name)})));
    }

    queryArray.push(getQueryFilter('private', typeof query.private !== 'undefined' ? query.private : false));

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

async function buildDataSetObject(dset, formdata, withMolData=false){
    let datasetObj = await JSON.parse(JSON.stringify(dset))
    const dataset = await formdata.dataset.find(data => {return data.name === dset.dataset.name})
    
    // assign versionInfo metadata
    datasetObj.dataset.versionInfo = await dataset.versions.find(version => {return version.version === dset.dataset.versionInfo})
    
    if(withMolData){
        // assign rnaTool commands
        for(let i = 0; i < datasetObj.rnaTool.length; i++){
            datasetObj.rnaTool[i].commands = await formdata.rnaTool.find(tool => {return tool.name === datasetObj.rnaTool[i].name}).commands
        }

        //assign rnaRef commands
        for(let i = 0; i < datasetObj.rnaRef.length; i++){
            const ref = await formdata.rnaRef.find(ref=> {return ref.name === datasetObj.rnaRef[i].name})
            datasetObj.rnaRef[i].genome = ref.genome
            datasetObj.rnaRef[i].source = ref.source
        }
        
        datasetObj.accompanyRNA = []
        datasetObj.accompanyDNA = []
        let accRNA = datasetObj.dataType.filter(dt => {return dt.type === 'RNA' && !dt.default})
        let accDNA = datasetObj.dataType.filter(dt => {return dt.type === 'DNA' && !dt.default})

        // assign accompanying RNA and DNA metadata
        if(accRNA.length){
            accRNA.forEach(rna => {
                const data = formdata.accompanyRNA.find(acc => {return (datasetObj.dataset.name === acc.dataset && rna.name === acc.name)})
                datasetObj.accompanyRNA.push(data)
            })
        }
        if(accDNA.length){
            accDNA.forEach(dna => {
                const data = formdata.accompanyDNA.find(acc => {return (datasetObj.dataset.name === acc.dataset && dna.name === acc.name)})
                datasetObj.accompanyDNA.push(data)
            })
        }
    }
    
    return datasetObj
}

const selectDatasets = async function(datasetType, query, projection=null){     
    // console.log(datasetType);
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
            default:
                queryFilter = getDefaultQuerySet(query);
        }
        console.log(queryFilter)
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
                datasetObj = await buildDataSetObject(dataset, form, true);
                break;
            case enums.dataTypes.toxicogenomics:
                datasetObj = await buildDataSetObject(dataset, form);
                break;
            case enums.dataTypes.xenographic:
                datasetObj = await buildDataSetObject(dataset, form, true);
                break;
            case enums.dataTypes.clinicalgenomics:
                datasetObj = await buildDataSetObject(dataset, form);
                break;
            case enums.dataTypes.radiogenomics:
                datasetObj = await buildDataSetObject(dataset, form, true);
                break;
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

        // add notes and disclaimers
        let name = datasetObj.dataset.name
        switch(name){
            case 'GDSC':
                datasetObj.dataset.versionInfo.version
                const ver = datasetObj.dataset.versionInfo.version.split('v')[1].slice(0, 1);
                name = datasetObj.dataset.name + ver;
                break;
            case 'Open TG-GATEs Human':
                name = 'Open TG-GATEs';
                break;
            case 'Open TG-GATEs Rat':
                name = 'Open TG-GATEs';
                break;
            case 'DrugMatrix Rat':
                name = 'DrugMatrix';
                break;
            default:
                break;
        }
        console.log(name);
        const notes = await datasetNotes.findOne(name);
        if(notes && notes.notes.acknowledgement){
            datasetObj.dataset.acknowledgement = notes.notes.acknowledgement;
            delete notes.notes.acknowledgement;
        }
        datasetObj.disclaimer = notes;

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