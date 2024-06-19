const axios = require('axios');
const DataObject = require('../../../db/models/data-object').DataObject;
const DatasetNote = require('../../../db/models/dataset-note');
const Dataset = require('../../../db/models/dataset');
const dataObjectHelper = require('../../../helper/data-object');

const getDataObjects = async (query) => {
    let result = [];
    const processed = await axios.get(`${process.env.DATA_PROCESSING_API}/api/data_object/list`, {params: query});
    console.log(processed);
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
        let { 
            pipeline: {
              pipeline_name,
              git_url,
              output_file,
              output_files,
              snakefile_path,
              config_file_path,
              conda_env_file_path
            } 
          } = req.body;

        const pipelineData = {
            pipeline_name,
            git_url,
            output_file,
            output_files,
            snakefile_path,
            config_file_path,
            conda_env_file_path
        };
        console.log(pipelineData);
        const res = await axios.post(`${process.env.FASTAPI_BASE_URL}/api/pipelines`, pipelineData);
        if (res.status == 200) {
            console.log('API call successful');
        }
        result = res.data.pipelines;
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
        console.log(res);
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
