const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true},
    password: String,
    registered: Boolean,
    admin: Boolean,
    pwdReset: {
        expire: Number,
        token: String
    },
    userDataObjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DatasetObject' }],
    shareLinks: [
        {
            datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'DatasetObject' },
            token: String,
            expire: Number
        }
    ]
});

module.exports = mongoose.model('User', userSchema);