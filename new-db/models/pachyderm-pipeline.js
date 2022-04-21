const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pipelineSchema = new Schema({
    data: Object,
    original: Boolean
});

module.exports = mongoose.model('PachydermPipeline', pipelineSchema);