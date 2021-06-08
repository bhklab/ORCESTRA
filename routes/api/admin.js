const mongo = require('../../db/mongo');
const datasetSelect = require('../../db/helper/dataset-select');
const dataSubmission = require('../../db/helper/data-submission');

const initialize = async (req, res) => {
    let result = {};
    try{
        result.datasets = await datasetSelect.selectDatasets('pset', {status: 'complete', private: false});
        result.submissions = await dataSubmission.list({}, {'projection': {'info': true}});
    }catch(error){
        console.log(error);
        result = error;
        res.status(500);
    }finally{
        res.send(result);
    }
}

const updateSubmission = async (req, res) => {
    console.log(req.params.id);
    try{
        await dataSubmission.updateOne({_id: mongo.ObjectID(req.params.id)}, {'info.status': 'complete'});
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send();
    }
}

const getSubmissionList = async (req, res) => {
    let data = []
    try{
        data = await dataSubmission.list({}, {'projection': {'info': true}});
    }catch(error){
        console.log(error);
        res.status(500);
    }finally{
        res.send(data);
    }
}

module.exports = {
    initialize,
    updateSubmission,
    getSubmissionList
}