var mongoose = require('mongoose');

var VendorType = new mongoose.Schema({
    job_id:{
        type: mongoose.Schema.Types.ObjectId //live job id
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId // mark favourite by
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favourite', VendorType);