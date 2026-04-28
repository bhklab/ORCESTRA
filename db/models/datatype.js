const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const datatypeSchema = new Schema({
	name: String,
	description: String,
	img: String,
	path: String,
});

module.exports = mongoose.model('Datatype', datatypeSchema);