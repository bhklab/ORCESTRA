const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datasetSchema = new Schema({
	name: { type: String, required: true },
	version: { type: String, required: true },
	datasetType: { type: String, required: true },
	disabled: Boolean,
	publications: [
		{
			citation: String,
			link: String,
		},
	],
	description: String,
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

module.exports = mongoose.model("Dataset", datasetSchema);
