const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: String,
    registered: Boolean,
    isAdmin: Boolean,
    resetToken: String,
    expire: Number,
    userPSets: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', userSchema);