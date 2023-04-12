const axios = require('axios');
const DataObject = require('../../../db/models/data-object').DataObject;
const dataObjectHelper = require('../../../helper/data-object');

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

const processedDataObjects = async (req, res) => {
    let result = [];
    try{
        const processed = await axios.get(`${process.env.DATA_PROCESSING_API}/api/data_object/list`, {params: req.query});
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
        console.log(res.data);
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result);
    }
}

const updateSubmission = async (req, res) => {
    // console.log(req.params.id);
    // try{
    //     await dataSubmission.updateOne({_id: mongo.ObjectID(req.params.id)}, {'info.status': 'complete'});
    // }catch(error){
    //     console.log(error);
    //     res.status(500);
    // }finally{
    //     res.send();
    // }
}

const getSubmissionList = async (req, res) => {
    // let data = []
    // try{
    //     data = await dataSubmission.list({}, {'projection': {'info': true}});
    // }catch(error){
    //     console.log(error);
    //     res.status(500);
    // }finally{
    //     res.send(data);
    // }
}

module.exports = {
    canonicalPSets,
    processedDataObjects,
    uploadDataObject,
    updateSubmission,
    getSubmissionList
}