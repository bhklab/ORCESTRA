const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: String,
    registered: Boolean,
    pwdReset: {
        expire: Number,
        token: String
    },
    userDataObjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DatasetObject' }]
});

module.exports = mongoose.model('User', userSchema);