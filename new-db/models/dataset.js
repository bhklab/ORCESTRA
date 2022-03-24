const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datasetSchema = new Schema({
    name: {type: String, required: true},
    version: {type: String, required: true},
    datasetType: String,
    status: {
        unavailable: Boolean,
        disabled: Boolean,
        requestDisabled: Boolean
    },
    publications: [{
        citation: String,
        link: String
    }],
    sensitivity: {
        source: String,
        data: String,
        version: String
    },
    availableData: [{
        name: String,
        datatype: String,
        source: String,
        expCount: {type: Number, required: false},
        noUpdates: {type: Boolean, required: false}
    }],
    datasetNote: { type: mongoose.Schema.Types.ObjectId, ref: 'DatasetNote' },
    stats: {
        cellLines: [String],
        drugs: [String],
        tissues: [String],
        numExperiments: Number,
        numGenes: Number
    },
    releaseNotes: {
        counts: [{
            name: String,
            current: Number,
            new: Number,
            removed: Number
        }],
        additionalNotes: Object
    }
});

module.exports = mongoose.model('Dataset', datasetSchema);