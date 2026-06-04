const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zenodoSandboxSchema = new Schema({
	
});

module.exports = mongoose.model('zenodoSandbox', zenodoSandboxSchema, "zenodo_sandbox");