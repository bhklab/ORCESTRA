import axios from "axios"
const CreatePipeline = require('../../../db/models/data_processing_api/create-pipeline');
const RunPipeline = require('../../../db/models/data_processing_api/run-pipeline');
const ZenodoObject = require('../../../db/models/data_processing_api/zenodo-object');


/**
 * Submits a pipeline for creation to the data processing API
 * @param {*} req git url and pipeline name
 * @param {*} res response from data processing API
 */
const createPipeline = async (req, res) => {
    try{
		const request = await axios.post(`${process.env.DATA_PROCESSING_API}/api/create-pipeline`, {
			git_url: req.body.git_url,
			pipeline_name: req.body.pipeline_name
		})
        res.send(request.data);
    } catch(error){
        console.log(error);
		res.status(500).send({
            message: 'Failed to create pipeline',
            error: error.response?.data || error.message
        });    
	}
}


/**
 * Get all pipelines submitted for creation on data processing API
 * @param {*} req 
 * @param {*} res 
 */
const getCreatedPipelines = async (req, res) => {
    try{
		const createdPipelines = await CreatePipeline.find();
        res.send(createdPipelines);
    } catch(error){
        console.log(error);
		res.status(500).send({
            message: 'Failed to get created pipelines',
            error: error.response?.data || error.message
        });    
	}
}


const runPipeline = async (req, res) => {
    let result = {};
    try{

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
