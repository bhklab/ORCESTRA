const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datasetSchema = new Schema({
	name: String,
	version: String,
	description: String,
	datasetType: String,
	status: {
		unavailable: Boolean,
		disabled: Boolean,
		requestDisabled: Boolean,
	},
	publications: [
		{
			citation: String,
			link: String,
		},
	],
	survival: {
		recistCriteria: Boolean,
		clinicalEndpoints: String,
	},
	datasetNote: { type: mongoose.Schema.Types.ObjectId, ref: "DatasetNote" },
	data: {
		drugResponse: [
			{
				name: String,
				description: String,
				url: String
			},
		],
		rna: [
			{
				name: String,
				description: String,
				url: String
			},
		],
		dna: [
			{
				name: String,
				description: String,
				url: String
			},
		],
		proteomics: [
			{
				name: String,
				description: String,
				url: String
			},
		],
		imagingFeatures: [
			{
				name: String,
				description: String,
				url: String
			},
		],
		imaging: [
			{
				name: String,
				description: String,
				url: String
			},
		],
	},
	releaseNotes: {
		cellLines:[
			{
				name: String,
				value: Number
			},
		],
		samples: [
			{
				name: String,
				value: Number
			},
		],
		drugs: [
			{
				name: String,
				value: Number
			},
		],
		drugExperiments: [
			[
				{
					name: String,
					value: Number
				},
			]
		],
		molecularData: [
			{
				name: String,
				value: Number
			},
		]
	}
});

module.exports = mongoose.model("Dataset", datasetSchema);
