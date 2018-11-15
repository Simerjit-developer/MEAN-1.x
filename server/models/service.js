var mongoose = require('mongoose');

var Service = new mongoose.Schema({
    title: {
        type: String, 
        required: '{PATH} is required!'
    },
    vendortype_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:'{PATH} is required!'
    },
    image:{type:String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', Service);