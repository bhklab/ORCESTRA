const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataFilterSchema = new Schema({
    datasettype: String,
    tools : [{
        name: String,
        label: String,
        genomicType: String,
        commands: [String]
    }],
    references: [{
        name: String,
        label: String,
        datatype: String,
        genomicType: String,
        source: String
    }],
    genome: [{
        name: String,
        label: String
    }],
    availableData: [{
        name: String,
        label: String,
        genomicType: String,
        default: Boolean
    }]
});

module.exports = mongoose.model('DataFilter', dataFilterSchema);