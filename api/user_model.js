var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    favorite: [{
        type: String
    }]
});

var userSchema=module.exports = mongoose.model('user', userSchema);