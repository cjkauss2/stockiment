var mongoose = require('mongoose');
// Setup schema
var tweetSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    score: {
        type: Number
    },
    twitterid: {
        type: String,
        required: true
    }
}, { collection: 'interestingTweets' });

var tweetSchema = module.exports = mongoose.model('interestingTweets', tweetSchema);
