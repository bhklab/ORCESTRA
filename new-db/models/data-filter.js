const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataFilterSchema = new Schema({
    datasetType: String,
    tools : [{
        name: String,
        label: String,
        genomicType: String,
        commands: [String]
    }],
    references: [{
        name: String,
        label: String,
        genome: String,
        genomicType: String,
        source: String
    }],
    genome: [String],
    availableData: [{
        name: String,
        label: String,
        genomicType: String,
        default: Boolean
    }]
});

module.exports = mongoose.model('DataFilter', dataFilterSchema);