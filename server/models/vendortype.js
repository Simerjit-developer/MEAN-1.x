var mongoose = require('mongoose');

var VendorType = new mongoose.Schema({
    title: {
        type: String, 
        required: '{PATH} is required!'
    },
    image:{type:String,
        //required: '{PATH} is required!'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorType', VendorType);