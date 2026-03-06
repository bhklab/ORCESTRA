const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datasetObjectSchema = new Schema({
	name: { type: String, required: true },
	version: { type: String, required: true },
	datasetType: { type: String, required: true },
	info: {
        status: {type: String, required: true},
        private: Boolean,
		disabled: Boolean,
        canonical: Boolean,
        numDownload: Number,
        createdBy: String,
        shareToken: String,
        dateCreated: Date,
        other: Object
    },
	publications: [
		{
			citation: String,
			link: String,
		},
	],
	description: String,
	name: { type: String, required: true },
	datasetType: { type: String, required: true },
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
	releaseNotes: { type: Schema.Types.Mixed, default: {} },
	tools: [
		{
			name: String,
			description: String,
			url: String
		}
	],
	rawData: [
		{
			heading: String,
			metaData: [
				{
					name: String,
					description: String,
					url: String,
				},
			]
		},
	],
	datasetNote: { type: mongoose.Schema.Types.ObjectId, ref: "DatasetNote" },

});

module.exports = mongoose.model("DatasetObject", datasetObjectSchema);
