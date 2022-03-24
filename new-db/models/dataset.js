const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datasetSchema = new Schema({
    name: {type: String, required: true},
    version: {type: String, required: true},
    datasettype: String,
    type: String,
    status: {
        unavailable: Boolean,
        requestDisabled: Boolean
    },
    publications: [{
        citation: String,
        link: String
    }],
    sensitivity: {
        source: String,
        version: String
    },
    availableData: [{
        name: String,
        type: String,
        source: String,
        expCount: Number,
        updated: Boolean
    }],
    datasetNote: { type: mongoose.Schema.Types.ObjectId, ref: 'DatasetNote' },
    releaseNotes: {
        genes: Number,
        tissues: Number,
        counts: [{
            name: String,
            current: Number,
            new: Number,
            removed: Number
        }]
    }
});

module.exports = mongoose.model('Dataset', datasetSchema);