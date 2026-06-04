const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const runPipelineSchema = new Schema({
	pipeline_name: String,
	run_id: String,
	branch: String,
	commit_id: String,
	config_file_path: String,
	create_pipeline: ObjectId,
	created_at: Date,
	current_stage: String,
	email: String,
	jenkins_build_url: String,
	jenkins_queue_url: String,
	larger_machine_use: Boolean,
	message: String,
	output_directories: [String],
	pipeline_run_command: String,
	pixi_use: Boolean,
	qc_command: String,
	qc_output_directory: String, // will be deprecated
	repo_url: String,
	snakefile_path: String,
	status: String,
	updatedAt: Date,
	version: String
});

module.exports = mongoose.model('RunPipeline', runPipelineSchema, "run_snakemake_pipeline");