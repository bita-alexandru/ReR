const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    preferredDomains: [String],
    excludedSites: [String],
    created: Date
});

module.exports = mongoose.model('User', userSchema);