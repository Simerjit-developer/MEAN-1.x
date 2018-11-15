var mongoose = require('mongoose');
var VendorInvite = new mongoose.Schema({
        project_id:{
            type: mongoose.Schema.Types.ObjectId //project id
        },
        event_id:{
            type: mongoose.Schema.Types.ObjectId // refers to project > events nested schema
        },
        vendortype_id:{
            type: mongoose.Schema.Types.ObjectId // refers to project > events >vendortype nested schema
        },
        service_id:{
            type: mongoose.Schema.Types.ObjectId // refers to project > events >service nested schema
        },
        name:{type:String},
        phone:{type:String},
        posted_by:{
            type: mongoose.Schema.Types.ObjectId //5b126966bcc8072e526346ad
        },
        location:{type:String},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
}, { usePushEach: true });

module.exports = mongoose.model('VendorInvite', VendorInvite);