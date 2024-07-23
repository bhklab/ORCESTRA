const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pipelineExecutionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  git_url: String,
  pipeline_name: String,
  output_files: [String],
  snakefile_path: String,
  config_file_path: String,
  conda_env_file_path: String,
  created_at: Date,
  last_updated_at: Date
});

module.exports = mongoose.model('PipelineExecution', pipelineExecutionSchema, 'snakemake_pipeline');
