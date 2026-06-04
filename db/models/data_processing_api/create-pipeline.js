const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createPipelineSchema = new Schema({
	git_url: String,
	pipeline_name: String
});

module.exports = mongoose.model('CreatePipeline', createPipelineSchema, "create_snakemake_pipeline" );