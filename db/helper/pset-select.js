const mongo = require('../mongo');
const formdata = require('./formdata');

function getQueryFilterSet(query){
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

module.exports = {
    selectPSets: async function(query, projection=null){       
        const db = await mongo.getDB();
        try{
            const collection = db.collection('pset')
            let queryFilter = getQueryFilterSet(query);
            const data = await collection.find(queryFilter, projection).toArray()
            return data
        }catch(err){
            console.log(err)
            throw err
        } 
    },

    selectPSetByDOI: async function(doi, projection=null){
        const db = await mongo.getDB();
        try{
            const form = await formdata.getFormData();

            const psetCollection = db.collection('pset')
            const pset = await psetCollection.findOne({'doi': doi, 'status' : 'complete'}, projection)
            const psetObj = await buildPSetObject(pset, form)

            const reqConfigCollection = db.collection('req-config')
            let pipelineConfig = {}
            pipelineConfig = await reqConfigCollection.findOne({'_id': psetObj._id})

            if(!pipelineConfig){
                const masterConfigCollection = db.collection('req-config-master')
                pipelineConfig = await masterConfigCollection.findOne({'pipeline.name': psetObj.dataset.versionInfo.pipeline})
            }
            psetObj.pipeline = pipelineConfig
            return psetObj
        }catch(err){
            console.log(err)
            throw err
        }
    },
}