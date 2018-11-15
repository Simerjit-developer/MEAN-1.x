var mongoose = require('mongoose');

var City = new mongoose.Schema({
    name: {
        type: String, 
        required: '{PATH} is required!'
    },
    order:{type:Number},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', City);