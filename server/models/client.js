var mongoose = require('mongoose');
var Client = new mongoose.Schema({
        project_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        added_by:{
            type: mongoose.Schema.Types.ObjectId
        },
        name: {type: String},
        email: {type: String},
        phone: {type: String},
        location: {type: String},
        status:{type: Number,default:0}, //0=Unregistered, 1= Registered, 2=Sent request, 3= Resent Request
        allow_guest_upload:{type:Array},
        allow_group_creation:{type: Boolean,default:false},
        share_metrics:{type:Array},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', Client);