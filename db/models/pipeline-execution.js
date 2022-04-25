const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pipelineExecutionSchema = new Schema({
    datasetType: String,
    datasetName: String,
    pipeline: {
        name: String,
        commitID: String,
        link: String
    },
    scripts: [{
        name: String,
        commitID: String,
        link: String
    }],
    dataObj: {
        filename: String,
        md5: String
    }
});

module.exports = mongoose.model('PipelineExecution', pipelineExecutionSchema);