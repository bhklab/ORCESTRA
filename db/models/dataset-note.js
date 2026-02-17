const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datasetNoteSchema = new Schema({
	name: String,
	dataVersion: String,
    disclaimer: String,
    usagePolicy: String,
    citations: [{
		citation: String,
		url: String
	}]
});

module.exports = mongoose.model('DatasetNote', datasetNoteSchema);