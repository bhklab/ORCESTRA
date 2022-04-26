const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datasetNoteSchema = new Schema({
    name: String,
    disclaimer: String,
    usagePolicy: String,
    citations: [String]
});

module.exports = mongoose.model('DatasetNote', datasetNoteSchema);