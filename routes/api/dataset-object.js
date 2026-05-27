const User = require('../../db/models/user');
const mongoose = require('mongoose');
const DatasetNote = require('../../db/models/dataset-note');
const DatasetObject = require('../../db/models/dataset-object');

const submitDataset = async (req, res) => {
    let result = [];
    try {
        const note = await DatasetNote.create(req.body.datasetNote);
        req.body.datasetNote = note._id;
        req.body.dateSubmitted = new Date();
        req.body.info.status = 'complete';
        await DatasetObject.create(req.body);
    } catch (error) {
        console.log("Validation error:", error.message);
        res.status(500);
    } finally {
        res.send(result);
    }
}


module.exports = {
    submitDataset
}