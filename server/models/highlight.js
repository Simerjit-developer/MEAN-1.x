var mongoose = require('mongoose');

var Highlight = new mongoose.Schema({
    title: {
        type: String, 
        required: '{PATH} is required!'
    },
    vendortype_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:'{PATH} is required!'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Highlight', Highlight);