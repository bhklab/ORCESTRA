const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zenodoObjectSchema = new Schema({
	
});

module.exports = mongoose.model('ZenodoObject', zenodoObjectSchema, "zenodo_object");