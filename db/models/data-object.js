const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataObjectSchema = new Schema({
    name: { type: String, required: true },
	datasetType: { type: String, required: true },
    info: {
        status: {type: String, required: true},
        private: Boolean,
        canonical: Boolean,
        numDownload: Number,
        createdBy: String,
        shareToken: String,
        dateCreated: Date,
        other: Object
    },
    repositories: {
		github: {
			commitId: String,
			url: String
		},
		zenodo: {
			version: String,
			doi: String,
			downloadLink: String
		},
        bioComputeObject: {
            doi: String,
            downloadLink: String
        },
	},
	releaseNotes: [
		{
			heading: String,
			notes: {
				name: String,
				description: String,
				url: String
			}
		}	
	],
	tools: [
		{
			name: String,
			description: String,
			url: String
		}
	],
	dataset: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' }
});

const DataObject = mongoose.model("DataObject", dataObjectSchema);

module.exports = {
    DataObject,
}