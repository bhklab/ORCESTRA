const mongo = require('../mongo');
const formdata = require('./formdata');
const metricData = require('./metricdata');
const datasetNotes = require('./dataset-notes');
const enums = require('../../helper/enum');

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
        pipelineConfig = await reqConfigCollection.findOne({'_id': mongo.ObjectID(datasetObj._id)});
        if(!pipelineConfig){
            const masterConfigCollection = db.collection('req-config-master');
            pipelineConfig = await masterConfigCollection.findOne({'pipeline.name': datasetObj.dataset.versionInfo.pipeline});
        }else{
            pipelineConfig = pipelineConfig.config;
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
    selectDatasetByDOI
}