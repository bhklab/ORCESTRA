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
        const processed = await axios.get(`${process.env.DATA_PROCESSING_URL}data_objects`, {params: req.query});
        result = processed.data.objects;
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(result)
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
    updateSubmission,
    getSubmissionList
}