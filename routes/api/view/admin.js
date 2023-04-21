const axios = require('axios');
const DataObject = require('../../../db/models/data-object').DataObject;
const DatasetNote = require('../../../db/models/dataset-note');
const Dataset = require('../../../db/models/dataset');
const dataObjectHelper = require('../../../helper/data-object');

const getDataObjects = async (query) => {
    let result = [];
    const processed = await axios.get(`${process.env.DATA_PROCESSING_API}/api/data_object/list`, {params: query});
    const publicObj = await DataObject.find().select('name datasetType repositories');
    result = processed.data.objects.map(object => {
        if(object.status === 'uploaded'){
           const found = publicObj.find(obj => obj.repositories.find(item => item.doi === object.doi));
           if(found){
            object.assigned = {
                name: found.name,
                datasetType: found.datasetType
            };
           }
        }
        return(object);
    });
    return(result)
}

const canonicalPSets = async (req, res) => {
    let result = [];
    try{
        const datasetType = req.query.datasetType ? req.query.datasetType : 'pset';
        result = await DataObject.find({datasetType: datasetType, 'info.status': 'complete'}).lean().populate('dataset', 'name version sensitivity');
        // get the doi and downloadlink for specific data version. Only applicable to PSets. For other datasets, use 1.0.
        result = result.map(obj => {
            let repo = obj.repositories.find(r => r.version === dataObjectHelper.getDataVersion(datasetType));
            delete obj.repositories;
            return({
                ...obj,
                doi: repo.doi,
                downloadLink: repo.downloadLink
            });
        });
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

const createPipeline = async (req, res) => {
    let result = {};
    try{
        let pipeline = req.body;
        let additionalParams = {};
        if(pipeline.additional_parameters.length > 0){
            let keys = pipeline.additional_parameters.map(param => param.name);
            for(const key of keys){
                const found = pipeline.additional_parameters.find(item => item.name === key);
                additionalParams[key] = found.value;
            }
        }
        pipeline.additional_parameters = additionalParams;
        pipeline.object_names = pipeline.object_names.filter(name => name.length > 0);
        if(pipeline.object_names.length === 0){
            pipeline.object_names = null;
        }
        const res = await axios.post(
            `${process.env.DATA_PROCESSING_API}/api/pipeline/create`, 
            pipeline,
            { headers: {'Authorization': process.env.DATA_PROCESSING_TOKEN} }
        );
        result = res.data;
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

const getPipelines = async (req, res) => {
    let result = [];
    try{
        const res = await axios.get(`${process.env.DATA_PROCESSING_API}/api/pipeline/list`);
        result = res.data.pipelines;
        result.sort((a, b) => a.name.localeCompare(b.name));
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result)
    }
}

const runPipeline = async (req, res) => {
    let result = {};
    try{
        let pipeline = req.body;
        console.log(pipeline);
        pipeline.preserved_data = pipeline.preserved_data.filter(data => data.length > 0);
        const res = await axios.post(
            `${process.env.DATA_PROCESSING_API}/api/pipeline/run`,
            pipeline,
            { headers: {'Authorization': process.env.DATA_PROCESSING_TOKEN} }
        );
        console.log(res.data);
        result.status = res.data.status;
        result.message = res.data.message;
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result)
    }
}

const processedDataObjects = async (req, res) => {
    let result = [];
    try{
        console.log(req.query);
        result = await getDataObjects(req.query);
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result)
    }
}

const uploadDataObject = async (req, res) => {
    let result = {};
    try{
        console.log(req.body)
        const res = await axios.post(
            `${process.env.DATA_PROCESSING_API}/api/data_object/upload`, 
            req.body,
            { headers: {'Authorization': process.env.DATA_PROCESSING_TOKEN} }
        );
        result.status = res.data.status;
        result.message = res.data.message;
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

const submitObject = async (req, res) => {
    let result = null;
    try{
        let objectType = req.body.objectType;
        let object = JSON.parse(req.body.object.text);
        switch(objectType){
            case 'datasetNote':
                let note = new DatasetNote(object);
                result = await note.save();
                break;
            case 'dataset':
                let dataset = new Dataset(object);
                result = await dataset.save();
                break;
            case 'dataObj':
                let dataObj = new DataObject(object);
                result = await dataObj.save();
                break;
            default:
                break;
        }
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result)
    }
}



module.exports = {
    canonicalPSets,
    createPipeline,
    getPipelines,
    runPipeline,
    processedDataObjects,
    uploadDataObject,
    submitObject
}