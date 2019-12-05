var mongoose = require('mongoose');
// Setup schema
var tweetSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    sentiment: {
        type: Number
    },
    url: {
        type: String,
        required: true
    }
});

var tweetSchema =module.exports = mongoose.model('tweet', tweetSchema);